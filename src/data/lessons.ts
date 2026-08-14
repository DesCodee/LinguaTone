export interface Phrase {
  text: string
  pinyin: string
  translation: string
}

export interface Lesson {
  id: string
  lang: 'zh' | 'ja' | 'ko'
  level: string
  title: string
  description: string
  phrases: Phrase[]
  order: number
}

export const lessons: Lesson[] = [
  // Chinese HSK1
  {
    id: 'zh-hsk1-1',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Greetings',
    description: 'Basic hello, goodbye, thank you',
    order: 1,
    phrases: [
      { text: '你好', pinyin: 'nǐ hǎo', translation: 'Hello' },
      { text: '谢谢', pinyin: 'xiè xie', translation: 'Thank you' },
      { text: '再见', pinyin: 'zài jiàn', translation: 'Goodbye' },
      { text: '对不起', pinyin: 'duì bù qǐ', translation: 'Sorry' },
      { text: '没关系', pinyin: 'méi guān xi', translation: "It's okay" },
    ],
  },
  {
    id: 'zh-hsk1-2',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Numbers',
    description: 'Count from 1 to 10',
    order: 2,
    phrases: [
      { text: '一、二、三', pinyin: 'yī, èr, sān', translation: 'One, two, three' },
      { text: '四、五、六', pinyin: 'sì, wǔ, liù', translation: 'Four, five, six' },
      { text: '七、八、九、十', pinyin: 'qī, bā, jiǔ, shí', translation: 'Seven, eight, nine, ten' },
    ],
  },
  {
    id: 'zh-hsk1-3',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Self Intro',
    description: 'Name, nationality, age',
    order: 3,
    phrases: [
      { text: '我叫李明', pinyin: 'wǒ jiào Lǐ Míng', translation: 'My name is Li Ming' },
      { text: '我是中国人', pinyin: 'wǒ shì Zhōng guó rén', translation: 'I am Chinese' },
      { text: '我今年二十岁', pinyin: 'wǒ jīn nián èr shí suì', translation: 'I am 20 years old' },
    ],
  },
  // Chinese HSK2
  {
    id: 'zh-hsk2-1',
    lang: 'zh',
    level: 'HSK 2',
    title: 'Daily Routine',
    description: 'Morning, work, evening',
    order: 4,
    phrases: [
      { text: '我每天早上七点起床', pinyin: 'wǒ měi tiān zǎo shang qī diǎn qǐ chuáng', translation: 'I get up at 7 every morning' },
      { text: '我去学校上课', pinyin: 'wǒ qù xué xiào shàng kè', translation: 'I go to school for class' },
      { text: '晚上我看电视', pinyin: 'wǎn shang wǒ kàn diàn shì', translation: 'I watch TV in the evening' },
    ],
  },
  // Japanese N5
  {
    id: 'ja-n5-1',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Greetings',
    description: 'Basic Japanese greetings',
    order: 5,
    phrases: [
      { text: 'こんにちは', pinyin: 'kon-ni-chi-wa', translation: 'Hello' },
      { text: 'ありがとう', pinyin: 'a-ri-ga-tō', translation: 'Thank you' },
      { text: 'さようなら', pinyin: 'sa-yō-na-ra', translation: 'Goodbye' },
      { text: 'おはよう', pinyin: 'o-ha-yō', translation: 'Good morning' },
    ],
  },
  {
    id: 'ja-n5-2',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Numbers',
    description: 'Japanese counting',
    order: 6,
    phrases: [
      { text: '一、二、三', pinyin: 'i-chi, ni, san', translation: 'One, two, three' },
      { text: '四、五、六', pinyin: 'shi, go, ro-ku', translation: 'Four, five, six' },
      { text: '七、八、九、十', pinyin: 'shi-chi, ha-chi, kyū, jū', translation: 'Seven, eight, nine, ten' },
    ],
  },
  // Korean TOPIK I
  {
    id: 'ko-topik1-1',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Greetings',
    description: 'Basic Korean greetings',
    order: 7,
    phrases: [
      { text: '안녕하세요', pinyin: 'an-nyeong-ha-se-yo', translation: 'Hello' },
      { text: '감사합니다', pinyin: 'gam-sa-ham-ni-da', translation: 'Thank you' },
      { text: '안녕히 가세요', pinyin: 'an-nyeong-hi ga-se-yo', translation: 'Goodbye (to someone leaving)' },
    ],
  },
  {
    id: 'ko-topik1-2',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Numbers',
    description: 'Korean native numbers',
    order: 8,
    phrases: [
      { text: '하나, 둘, 셋', pinyin: 'ha-na, dul, set', translation: 'One, two, three' },
      { text: '넷, 다섯, 여섯', pinyin: 'net, da-seot, yeo-seot', translation: 'Four, five, six' },
    ],
  },
]

export function getLessonsByLang(lang: string): Lesson[] {
  return lessons.filter((l) => l.lang === lang).sort((a, b) => a.order - b.order)
}

export function isLessonUnlocked(lesson: Lesson, completed: string[]): boolean {
  if (lesson.order === 1) return true
  const prevLesson = lessons.find((l) => l.lang === lesson.lang && l.order === lesson.order - 1)
  if (!prevLesson) return true
  return completed.includes(prevLesson.id)
}