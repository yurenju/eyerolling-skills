const shell = require('shelljs');
const path = require('path');
const os = require('os');

// Common utility functions for installation
function checkFileConflicts(files, targetDir) {
  const conflicts = [];
  files.forEach(file => {
    const filename = path.basename(file);
    const targetPath = path.join(targetDir, filename);
    if (shell.test('-f', targetPath)) {
      conflicts.push(filename);
    }
  });
  return conflicts;
}

function createTargetDirectory(targetDir) {
  if (!shell.test('-d', targetDir)) {
    console.log(`📁 Creating directory: ${targetDir}`);
    shell.mkdir('-p', targetDir);
    if (shell.error()) {
      throw new Error(`Failed to create directory: ${shell.error()}`);
    }
  }
}

function copyFilesWithLogging(files, targetDir) {
  console.log('📋 Copying files...');
  let successCount = 0;
  let errorCount = 0;
  
  files.forEach(file => {
    const filename = path.basename(file);
    console.log(`  Copying ${filename}...`);
    
    shell.cp(file, targetDir);
    if (shell.error()) {
      console.error(`  ❌ Error: Failed to copy ${filename}`);
      errorCount++;
    } else {
      console.log(`  ✅ Copied ${filename}`);
      successCount++;
    }
  });
  
  return { successCount, errorCount };
}

function installDirectoryFiles(sourcePattern, targetDirName, directoryLabel) {
  const targetDir = path.join(os.homedir(), '.claude', targetDirName);
  console.log(`Target directory: ${targetDir}`);
  
  // Get list of .md files to install
  const files = shell.ls(sourcePattern);
  if (files.code !== 0) {
    return {
      success: false,
      error: `${directoryLabel} directory not found or no .md files available`,
      targetDir,
      files: [],
      conflicts: [],
      successCount: 0,
      errorCount: 0
    };
  }
  
  console.log(`Found ${files.length} ${directoryLabel.toLowerCase()} files to install: ${files.map(f => path.basename(f)).join(', ')}`);
  
  // Check for conflicting files
  const conflicts = checkFileConflicts(files, targetDir);
  
  return {
    success: true,
    targetDir,
    files,
    conflicts,
    successCount: 0,
    errorCount: 0
  };
}

function installConfig() {
  try {
    // Check for overwrite flag
    const hasOverwriteFlag = process.argv.includes('overwrite');
    
    console.log('📦 Starting installation...');
    console.log(`Platform: ${process.platform}`);
    console.log(`Overwrite mode: ${hasOverwriteFlag ? 'enabled' : 'disabled'}`);
    
    // Prepare installation for both directories
    const commandsInfo = installDirectoryFiles('commands/*.md', 'commands', 'Commands');
    const agentsInfo = installDirectoryFiles('agents/*.md', 'agents', 'Agents');
    
    // Check if any directory scan failed
    if (!commandsInfo.success && !agentsInfo.success) {
      throw new Error('Neither commands nor agents directory found');
    }
    
    // Collect all conflicts
    const allConflicts = [];
    if (commandsInfo.success && commandsInfo.conflicts.length > 0) {
      allConflicts.push(...commandsInfo.conflicts.map(f => `commands/${f}`));
    }
    if (agentsInfo.success && agentsInfo.conflicts.length > 0) {
      allConflicts.push(...agentsInfo.conflicts.map(f => `agents/${f}`));
    }
    
    // If conflicts exist and no --overwrite flag, stop installation
    if (allConflicts.length > 0 && !hasOverwriteFlag) {
      console.log(`❌ Found existing files: ${allConflicts.join(', ')}`);
      console.log('Use overwrite flag to overwrite existing files:');
      console.log('npm run install-config -- overwrite');
      process.exit(1);
    }
    
    if (allConflicts.length > 0) {
      console.log(`⚠️  Will overwrite ${allConflicts.length} existing files: ${allConflicts.join(', ')}`);
    }
    
    let totalSuccessCount = 0;
    let totalErrorCount = 0;
    const installedFiles = [];
    
    // Install commands if available
    if (commandsInfo.success) {
      createTargetDirectory(commandsInfo.targetDir);
      const result = copyFilesWithLogging(commandsInfo.files, commandsInfo.targetDir);
      totalSuccessCount += result.successCount;
      totalErrorCount += result.errorCount;
      commandsInfo.files.forEach(file => installedFiles.push({ type: 'commands', filename: path.basename(file) }));
    }
    
    // Install agents if available
    if (agentsInfo.success) {
      createTargetDirectory(agentsInfo.targetDir);
      const result = copyFilesWithLogging(agentsInfo.files, agentsInfo.targetDir);
      totalSuccessCount += result.successCount;
      totalErrorCount += result.errorCount;
      agentsInfo.files.forEach(file => installedFiles.push({ type: 'agents', filename: path.basename(file) }));
    }
    
    // Final user feedback
    console.log('');
    if (totalErrorCount > 0) {
      console.log(`⚠️  Installation completed with ${totalErrorCount} errors out of ${totalSuccessCount + totalErrorCount} files`);
      process.exit(1);
    } else {
      console.log(`✅ Installation successful! Installed ${totalSuccessCount} files`);
      if (allConflicts.length > 0) {
        console.log(`⚠️  Overwritten ${allConflicts.length} existing files`);
      }
    }
    
    // Display installed files by type
    console.log('');
    console.log('📋 Installed files:');
    
    const commandFiles = installedFiles.filter(f => f.type === 'commands');
    const agentFiles = installedFiles.filter(f => f.type === 'agents');
    
    if (commandFiles.length > 0) {
      console.log('  Commands:');
      commandFiles.forEach(file => {
        console.log(`    • ${file.filename}`);
      });
    }
    
    if (agentFiles.length > 0) {
      console.log('  Agents:');
      agentFiles.forEach(file => {
        console.log(`    • ${file.filename}`);
      });
    }
    
    console.log('');
    if (commandFiles.length > 0 && agentFiles.length > 0) {
      console.log('🎉 You can now use these commands and agents in Claude Code!');
    } else if (commandFiles.length > 0) {
      console.log('🎉 You can now use these commands in Claude Code!');
    } else if (agentFiles.length > 0) {
      console.log('🎉 You can now use these agents in Claude Code!');
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute installation if script is run directly
if (require.main === module) {
  installConfig();
}

module.exports = {
  installConfig,
  checkFileConflicts,
  createTargetDirectory,
  copyFilesWithLogging,
  installDirectoryFiles
};