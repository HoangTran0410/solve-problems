const LanguageDetect = require("languagedetect");
const lngDetector = new LanguageDetect();

// ====== Liệt kê tất cả hoán vị tổ hợp từ mảng đầu vào ======
// https://stackoverflow.com/a/20871714/11898496
async function permutator(inputArr, onFoundOne) {
  var results = [];
  async function permute(arr, memo) {
    var cur,
      memo = memo || [];
    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
        onFoundOne?.(memo.concat(cur).join(""));
      }
      await permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  return await permute(inputArr);
}

function getScore(text, lang) {
  let detectResult = lngDetector.detect(text);
  for (let [langKey, score] of detectResult) {
    if (langKey == lang) {
      return score;
    }
  }
}

// https://stackoverflow.com/a/60963711/11898496
const shuffleString = (str) =>
  [...str].sort(() => Math.random() - 0.5).join("");

const stringToArray = (str) => str.split("");
const arrayToString = (arr) => arr.join("");

(async () => {
  let scores = [];
  let noScores = [];

  let list = await permutator(
    stringToArray(shuffleString("Viến gốl")),
    (text) => {
      let score = getScore(text, "vietnamese");
      if (score) {
        scores.push({ score, text });
        scores = scores.sort((a, b) => b.score - a.score);
        console.log(
          text,
          score,
          scores.slice(0, 4).map((_) => _.text)
        );
      } else {
        noScores.push({ score, text });
        process.stdout.write(text + "\r");
      }
    }
  );

  console.log(
    scores.map((_) => _.text).join(", "),
    noScores.map((_) => _.text).join(", ")
  );
})();
