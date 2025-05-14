const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { runCommand } = require('../utils/processRunner');
const logger = require('../utils/logger');
const { removeComments } = require('../preprocessors/commentRemover');

const TEMP_DIR = path.resolve(__dirname, '../../temp_csharp');
const ICON_PATH = path.resolve(__dirname, '../../assets/hapksz_icon.ico');

/**
 * Converts a C# source file to a standalone .exe using dotnet publish.
 * Cleans comments, creates minimal project, publishes self-contained exe with icon.
 * @param {string} inputFile - Path to the C# source file.
 * @param {string} outputExe - Desired output executable filename.
 */
async function convert(inputFile, outputExe) {
  if (!inputFile.endsWith('.cs')) {
    throw new Error('Input file must have .cs extension');
  }

  logger.info('Reading and cleaning C# source code...');
  const absInput = path.resolve(inputFile);
  const absTempDir = TEMP_DIR;

  await fs.mkdir(absTempDir, { recursive: true });

  let code = await fs.readFile(absInput, 'utf8');
  code = removeComments(code);

  const tempProgramCs = path.join(absTempDir, 'Program.cs');
  await fs.writeFile(tempProgramCs, code, 'utf8');

  // Create minimal .csproj file for publishing
  const projectFile = path.join(absTempDir, 'hapksz_temp.csproj');
  const exeName = outputExe.endsWith('.exe') ? outputExe.slice(0, -4) : outputExe;

  const csprojContent = `
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net7.0</TargetFramework>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <SelfContained>true</SelfContained>
    <PublishSingleFile>true</PublishSingleFile>
    <IncludeAllContentForSelfExtract>true</IncludeAllContentForSelfExtract>
    <EnableCompressionInSingleFile>true</EnableCompressionInSingleFile>
    <AssemblyName>${exeName}</AssemblyName>
    <ApplicationIcon>${ICON_PATH}</ApplicationIcon>
    <GenerateAssemblyInfo>false</GenerateAssemblyInfo>
  </PropertyGroup>
</Project>`.trim();

  await fs.writeFile(projectFile, csprojContent, 'utf8');

  logger.info(`Publishing self-contained executable ${outputExe}...`);

  try {
    // Run dotnet publish
    await runCommand('dotnet', [
      'publish',
      projectFile,
      '-c', 'Release',
      '-r', 'win-x64',
      '--self-contained', 'true',
      '/p:PublishSingleFile=true',
      '/p:IncludeAllContentForSelfExtract=true',
      '/p:EnableCompressionInSingleFile=true',
      '/p:AssemblyName=' + exeName,
      '/p:ApplicationIcon=' + ICON_PATH,
      '-o', path.resolve(absTempDir, 'publish')
    ]);

    // Move the generated exe to the desired output path
    const publishedExe = path.join(absTempDir, 'publish', `${exeName}.exe`);
    const finalExe = path.resolve(outputExe);

    await fs.rename(publishedExe, finalExe);

    // Clean temporary folder
    await fs.rm(absTempDir, { recursive: true, force: true });

    logger.info(`C# executable generated at: ${finalExe}`);
  } catch (error) {
    throw new Error(`C# publish failed: ${error.message}`);
  }
}

module.exports = { convert };
