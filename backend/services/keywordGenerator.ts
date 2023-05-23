import { getPostsFromDb } from "../db/postQueries";
import natural from 'natural';
import * as stopword from 'stopword';
import { getSubLang } from "../db/subQueries";
const TfIdf = natural.TfIdf;

const stopwordLangs: {[index: string]: string[]} = {
    "es": stopword.spa,
    "en": stopword.eng,
    "en-us": stopword.eng,
    "de": stopword.deu,
    "fr": stopword.fra,
    "ca": stopword.cat,
    "nl": stopword.nld,
    "fi": stopword.fin,
    "he": stopword.heb,
    "gd": stopword.gle,
    "it": stopword.ita,
    "ja": stopword.jpn,
    "pl": stopword.pol,
    "pt": stopword.por,
    "ru": stopword.rus,
    "sv": stopword.swe,
    "tr": stopword.tur,
    "lv": stopword.lav,
    "la": stopword.lat,
}

export async function generateKeywords(sub: string) {
    const data = await getPostsFromDb(sub);
    const lang: string = await getSubLang(sub);
    const stopwords = stopwordLangs[lang].concat(['just', 'not', 'don', 've', 're', 't', 'll', 'didn']);
    const tfidf = new TfIdf();
    const keywordScores: { term: string, score: number, numDocuments: number }[]= [];

    data.forEach((post) => {
        tfidf.addDocument(post.title + "\n" + post.selftext + ' ');
    });

    for (let i = 0; i < data.length; i++) {
        tfidf.listTerms(i).forEach((item) => {
            addKeywordToList(item, keywordScores, stopwords);
        });
    }

    keywordScores.sort((a, b) => {
        return b.score - a.score;
    });

    return keywordScores.slice(0, 50);
}

function addKeywordToList(item: natural.TfIdfTerm, keywordScores: {
    numDocuments: number; term: string; score: number; 
}[], stopwords: string[]) {
    const existingKeyword = keywordScores.find((kw) => { return kw.term === item.term; });

    if (existingKeyword) {
        existingKeyword.score = roundDecimal(existingKeyword.score + item.tfidf);
        existingKeyword.numDocuments++;
    } else if (!stopwords.includes(item.term.toLowerCase())) {
        keywordScores.push({ term: item.term, score: roundDecimal(item.tfidf), numDocuments: 1 });
    }
}

function roundDecimal(num: number): number {
    return Number(num.toFixed(2));
}