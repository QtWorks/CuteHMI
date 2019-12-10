var FileInfo = require("qbs.FileInfo");

function writeComment(f)
{
	f.writeLine("# This file has been autogenerated by 'cutehmi.qmldir' Qbs module.")
}

function writeModule(f, moduleIdentifier)
{
	f.writeLine("module " + moduleIdentifier)
}

function writeInputs(f, config)
{
	// Take into account source base difference, betewn inputs and 'qmldir', which happens, when 'qmldir' belongs to a puppet.
	var pathPrefix = FileInfo.relativePath(config.inputsSourceBase, config.outputSourceBase)

	// Take into account difference between installation direcotry of 'qmldir' file and inputs, which also happens for puppets.
	pathPrefix = FileInfo.relativePath(config.outputInstallDir, config.inputsInstallDir) + "/" + pathPrefix

	for (var i = 0; i < config.inputs.length; i++) {
		// Calculate relative path between given input and 'qmldir' file (output) location.
		// FileInfo.relativePath() assumes first argument to be a directory, thus get directory of 'qmldir' with FileInfo.path().
		var relativePath = FileInfo.relativePath(FileInfo.path(config.output.filePath), config.inputs[i].filePath)
		// Add prefix and clean path from redundant '..' and '.'.
		relativePath = FileInfo.cleanPath(pathPrefix + "/" + relativePath)

		var j
		for (j = 0; j < config.excludedInputs.length; j++)
			if (relativePath.match(config.excludedInputs[j]))
				break
		if (j !== config.excludedInputs.length)	// This means pattern has been found.
			continue

		if (config.inputs[i].fileTags.contains("qml"))
			writeQmlType(f, config.inputs[i], relativePath, config.major, config.minor, config.filesMap, config.singletons)
		else if (config.inputs[i].fileTags.contains("js"))
			writeJsResource(f, config.inputs[i], relativePath, config.major, config.minor, config.filesMap)
	}
}

function writeQmlType(f, qmlInput, relativePath, major, minor, filesMap, singletons)
{
	var maybeSingleton = ""
	if (singletons.contains(qmlInput.baseName))
		maybeSingleton = "singleton "

	if (filesMap[relativePath] !== undefined)
		f.writeLine(filesMap[qmlInput.fileName] + " " + relativePath)
	else
		f.writeLine(maybeSingleton + qmlInput.baseName + " " + major + "." + minor + " " + relativePath)
}

function writeJsResource(f, jsInput, relativePath, major, minor, filesMap)
{
	if (filesMap[relativePath] !== undefined)
		f.writeLine(filesMap[jsInput.fileName] + " " + relativePath)
	else
		f.writeLine(jsInput.baseName + " " + major + "." + minor + " " + relativePath)
}

function writePlugins(f, plugins, className)
{
	for (var i = 0; i < plugins.length; i++)
		f.writeLine("plugin " + plugins[i].name + " " + plugins[i].path)
	f.writeLine("classname " + className)
}

function writeTypeInfo(f, typeInfo)
{
	f.writeLine("typeinfo " +  typeInfo)
}

function writeDesignerSupported(f)
{
	f.writeLine("designersupported")
}

function writeAdditionalEntries(f, additionalEntries)
{
	for (var i = 0; i < additionalEntries.length; i++)
		f.writeLine(additionalEntries[i])
}

function writeEntries(f, config)
{
	writeComment(f)

	f.writeLine("");
	writeModule(f, config.moduleIdentifier)

	if (config.inputs !== undefined) {
		f.writeLine("");
		writeInputs(f, config)
	}

	if (config.hasPlugin) {
		f.writeLine("");
		writePlugins(f, config.plugins, config.className)
	}

	if (config.typeInfo !== undefined) {
		f.writeLine("")
		writeTypeInfo(f, config.typeInfo)
	}

	if (config.designerSupported) {
		f.writeLine("")
		writeDesignerSupported(f)
	}

	if (config.additionalEntries.length > 0) {
		f.writeLine("")
		writeAdditionalEntries(f, config.additionalEntries)
	}
}

function writeGitignore(f)
{
	var qmldirLinePresent = false
	var empty = false
	if (f.atEof())
		empty = true

	while (!f.atEof())
		if (f.readLine() === "qmldir")
			qmldirLinePresent = true

	if (!qmldirLinePresent) {
		if (!empty)
			f.writeLine("")
		f.writeLine("# Ignore 'qmldir' files (entry added by 'cutehmi.qmldir' Qbs module).")
		f.writeLine("qmldir");
	}
}

//(c)C: Copyright © 2019, Michał Policht <michal@policht.pl>. All rights reserved.
//(c)C: This file is a part of CuteHMI.
//(c)C: CuteHMI is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//(c)C: CuteHMI is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
//(c)C: You should have received a copy of the GNU Lesser General Public License along with CuteHMI.  If not, see <https://www.gnu.org/licenses/>.