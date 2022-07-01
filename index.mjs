import { parse } from 'yaml'
import fetch from 'node-fetch';
import { toRomaji } from 'wanakana';
import fs from 'fs';
import { join } from 'path'

const dataYaml = "https://raw.githubusercontent.com/willnet/gimei/main/lib/data/names.yml"
const commonWordsTxt = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/ja/ja_full.txt"

const pickUpHiragana = (nameInYaml) => nameInYaml[1]
const convert2Romaji = (hiragana) => toRomaji(hiragana)
const uniq = (romajiNames) => [...new Set(romajiNames)]
const generateNames = (nameInYaml) => convert2Romaji(pickUpHiragana(nameInYaml))
const outputFile = (names, fileName) => {
  const path = join(process.cwd(), 'data', `${fileName}.txt`);
  try {
    fs.existsSync(path) && fs.unlinkSync(path)
    fs.writeFileSync(path, names.join('\n'));
  } catch (err) {
    console.error(err);
  }
}
const txt2Data = (txt) => txt.split(/\r?\n/).map(data => data.split(' '))

const generateNameLists = async () => {
  let names;
  try{
    names = await fetch(dataYaml)
      .then(res => res.blob())
      .then(blob => blob.text())
      .then(yamlAsString => parse(yamlAsString))
  } catch (e) {
    console.error("An error occurred while fetching name data.")
    console.error(e)
  }

  const firstNames = uniq([...names.first_name.male, ...names.first_name.female].map(generateNames));
  const lastNames = uniq(names.last_name.map(generateNames));

  outputFile(firstNames, 'first-names.txt')
  outputFile(lastNames, 'last-names.txt')
}

const generateCommonWordlist = async () => {
  let commonWords;
  try{
    commonWords = await fetch(commonWordsTxt)
      .then(res => res.blob())
      .then(blob => blob.text())
      .then(listTxt => txt2Data(listTxt))
  } catch (e) {
    console.error("An error occurred while fetching common word data.")
    console.error(e)
  }

  // todo: the way to convert kanji to romaji.
}


generateNameLists()
// generateCommonWordlist()