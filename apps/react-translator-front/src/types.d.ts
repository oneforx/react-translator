export type ISentences = {
  [key: string]: {
    sentenceName?: string,
    sentenceTraductions: Record<string, string>
  }
}

type TProject = {
  currentSentenceId: string,
  currentSentenceFlagCode: string,
  sentences: ISentences
}
