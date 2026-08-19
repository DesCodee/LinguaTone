export interface Phrase {
  text: string
  pinyin: string
  translation: string
  toneTip?: string
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
  // ==========================================
  // CHINESE (MANDARIN) — HSK 1, 2, 3
  // ==========================================
  {
    id: 'zh-hsk1-1',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Essential Greetings',
    description: 'Basic polite phrases, hello, thanks & apology',
    order: 1,
    phrases: [
      { text: '你好', pinyin: 'nǐ hǎo', translation: 'Hello', toneTip: '3rd tone + 3rd tone → becomes 2nd + 3rd' },
      { text: '谢谢', pinyin: 'xiè xie', translation: 'Thank you', toneTip: '4th tone (falling) + neutral tone' },
      { text: '不客气', pinyin: 'bú kè qi', translation: "You're welcome", toneTip: '2nd tone + 4th tone + neutral' },
      { text: '再见', pinyin: 'zài jiàn', translation: 'Goodbye', toneTip: 'Sharp 4th tone + 4th tone falling' },
      { text: '对不起', pinyin: 'duì bu qǐ', translation: 'Sorry / Excuse me', toneTip: '4th tone + neutral + dipping 3rd' },
      { text: '没关系', pinyin: 'méi guān xi', translation: "It's alright / No problem", toneTip: '2nd rising + 1st high + neutral' },
    ],
  },
  {
    id: 'zh-hsk1-2',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Numbers & Counting',
    description: 'Master digits 1 to 10 and ask for prices',
    order: 2,
    phrases: [
      { text: '一、二、三', pinyin: 'yī, èr, sān', translation: 'One, two, three', toneTip: '1st high flat, 4th falling, 1st high flat' },
      { text: '四、五、六', pinyin: 'sì, wǔ, liù', translation: 'Four, five, six', toneTip: '4th falling, 3rd dipping, 4th falling' },
      { text: '七、八、九、十', pinyin: 'qī, bā, jiǔ, shí', translation: 'Seven, eight, nine, ten', toneTip: 'High 1st, high 1st, dipping 3rd, rising 2nd' },
      { text: '这个多少钱？', pinyin: 'zhè ge duō shao qián?', translation: 'How much is this?', toneTip: '4th + neutral + 1st + neutral + 2nd rising' },
      { text: '太贵了！', pinyin: 'tài guì le!', translation: 'Too expensive!', toneTip: 'Strong double 4th tone falling' },
    ],
  },
  {
    id: 'zh-hsk1-3',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Self-Introduction',
    description: 'Name, nationality and meeting people',
    order: 3,
    phrases: [
      { text: '我叫李明', pinyin: 'wǒ jiào Lǐ Míng', translation: 'My name is Li Ming', toneTip: '3rd + 4th + 3rd + 2nd' },
      { text: '我是学生', pinyin: 'wǒ shì xué sheng', translation: 'I am a student', toneTip: '3rd + 4th + 2nd rising + neutral' },
      { text: '你是哪国人？', pinyin: 'nǐ shì nǎ guó rén?', translation: 'Where are you from?', toneTip: '3rd + 4th + 3rd + 2nd + 2nd' },
      { text: '很高兴认识你', pinyin: 'hěn gāo xìng rèn shi nǐ', translation: 'Nice to meet you', toneTip: '3rd + 1st + 4th + 4th + neutral + 3rd' },
    ],
  },
  {
    id: 'zh-hsk1-4',
    lang: 'zh',
    level: 'HSK 1',
    title: 'Dining & Ordering',
    description: 'Order food, tea, and restaurant essentials',
    order: 4,
    phrases: [
      { text: '我想喝茶', pinyin: 'wǒ xiǎng hē chá', translation: 'I want to drink tea', toneTip: '3rd + 3rd (sandhi) + 1st + 2nd' },
      { text: '请给我米饭', pinyin: 'qǐng gěi wǒ mǐ fàn', translation: 'Please give me rice', toneTip: 'Continuous 3rd tones cascade + 4th' },
      { text: '这个很好吃', pinyin: 'zhè ge hěn hǎo chī', translation: 'This is very delicious', toneTip: '4th + neutral + 2nd (sandhi) + 3rd + 1st' },
      { text: '服务员，买单！', pinyin: 'fú wù yuán, mǎi dān!', translation: 'Server, the bill please!', toneTip: '2nd + 4th + 2nd, 3rd + 1st' },
    ],
  },
  {
    id: 'zh-hsk2-1',
    lang: 'zh',
    level: 'HSK 2',
    title: 'Daily Routine & Time',
    description: 'Schedules, wake up, classes and hobbies',
    order: 5,
    phrases: [
      { text: '现在几点了？', pinyin: 'xiàn zài jǐ diǎn le?', translation: 'What time is it now?', toneTip: '4th + 4th + 3rd + 3rd (sandhi) + neutral' },
      { text: '我每天早上七点起床', pinyin: 'wǒ měi tiān zǎo shang qī diǎn qǐ chuáng', translation: 'I wake up at 7 every morning', toneTip: 'Maintain clear pitch contour rhythm' },
      { text: '我去学校上课', pinyin: 'wǒ qù xué xiào shàng kè', translation: 'I go to school for classes', toneTip: 'Crisp 4th tone downbeats' },
      { text: '晚上我看书和听音乐', pinyin: 'wǎn shang wǒ kàn shū hé tīng yīn yuè', translation: 'In the evening I read and listen to music', toneTip: 'Smooth transition across 1st and 4th tones' },
    ],
  },
  {
    id: 'zh-hsk2-2',
    lang: 'zh',
    level: 'HSK 2',
    title: 'Directions & Travel',
    description: 'Ask for directions, metros and taxis',
    order: 6,
    phrases: [
      { text: '请问地铁站在哪儿？', pinyin: 'qǐng wèn dì tiě zhàn zài nǎr?', translation: 'Where is the metro station?', toneTip: 'Gentle question cadence with erhua' },
      { text: '往前走，向右拐', pinyin: 'wǎng qián zǒu, xiàng yòu guǎi', translation: 'Go straight ahead and turn right', toneTip: 'Clear directional emphasis' },
      { text: '离这里很近', pinyin: 'lí zhè lǐ hěn jìn', translation: 'Very close to here', toneTip: '2nd rising + 4th + 3rd + 3rd + 4th' },
      { text: '我们坐出租车去吧', pinyin: 'wǒ men zuò chū zū chē qù ba', translation: "Let's take a taxi", toneTip: 'Triple high 1st tone in 出租车' },
    ],
  },
  {
    id: 'zh-hsk3-1',
    lang: 'zh',
    level: 'HSK 3',
    title: 'Opinions & Feelings',
    description: 'Express feelings, suggestions and wishes',
    order: 7,
    phrases: [
      { text: '我觉得这个主意很不错', pinyin: 'wǒ jué de zhè ge zhǔ yi hěn bù cuò', translation: 'I think this idea is very good', toneTip: 'Natural spoken tone flow' },
      { text: '虽然有点累，但是很开心', pinyin: 'suī rán yǒu diǎn lèi, dàn shì hěn kāi xīn', translation: "Although a bit tired, I'm very happy", toneTip: 'Balanced clause intonation' },
      { text: '希望一切顺利！', pinyin: 'xī wàng yí qiè shùn lì!', translation: 'Hope everything goes smoothly!', toneTip: 'Crisp celebratory intonation' },
      { text: '我们明天准时出发', pinyin: 'wǒ men míng tiān zhǔn shí chū fā', translation: 'We will depart on time tomorrow', toneTip: 'Firm sentence cadence' },
    ],
  },

  // ==========================================
  // JAPANESE — JLPT N5, N4
  // ==========================================
  {
    id: 'ja-n5-1',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Daily Greetings & Politeness',
    description: 'Master pitch accents on greetings and polite thanks',
    order: 1,
    phrases: [
      { text: 'こんにちは', pinyin: 'kon-ni-chi-wa', translation: 'Hello / Good afternoon', toneTip: 'Heiban (flat) pitch accent: rises after ko, stays even' },
      { text: 'おはようございます', pinyin: 'o-ha-yō go-zai-ma-su', translation: 'Good morning (polite)', toneTip: 'Nakadaka accent with smooth long vowel ō' },
      { text: 'ありがとうございます', pinyin: 'a-ri-ga-tō go-zai-ma-su', translation: 'Thank you very much', toneTip: 'Nakadaka drop after to, soften final su' },
      { text: 'すみません', pinyin: 'su-mi-ma-sen', translation: 'Excuse me / Sorry', toneTip: 'Heiban accent, very common in daily life' },
      { text: 'さようなら', pinyin: 'sa-yō-na-ra', translation: 'Goodbye', toneTip: 'Elongated yō sound with calm descent' },
    ],
  },
  {
    id: 'ja-n5-2',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Counters & Essentials',
    description: 'Japanese native counting and asking prices',
    order: 2,
    phrases: [
      { text: 'ひとつ、ふたつ、みっつ', pinyin: 'hi-to-tsu, fu-ta-tsu, mit-tsu', translation: 'One, two, three (items)', toneTip: 'Notice the double consonant sokuon pause in mit-tsu' },
      { text: 'これをください', pinyin: 'ko-re o ku-da-sa-i', translation: 'Please give me this', toneTip: 'Atamadaka accent on ko-re, smooth particle o' },
      { text: 'いくらですか？', pinyin: 'i-ku-ra de-su-ka?', translation: 'How much is it?', toneTip: 'Atamadaka accent with rising question tail' },
      { text: 'お願いします', pinyin: 'o-ne-ga-i-shi-ma-su', translation: 'Please (make a request)', toneTip: 'Polite tone with gentle devoiced su' },
    ],
  },
  {
    id: 'ja-n5-3',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Self-Introduction & Background',
    description: 'Introduce your name, language study and origins',
    order: 3,
    phrases: [
      { text: 'はじめまして、田中です', pinyin: 'ha-ji-me-ma-shi-te, Ta-na-ka de-su', translation: 'Nice to meet you, I am Tanaka', toneTip: 'Clear mora timing on each syllable' },
      { text: 'どうぞよろしくお願いします', pinyin: 'dō-zo yo-ro-shi-ku o-ne-ga-i-shi-ma-su', translation: 'Pleased to make your acquaintance', toneTip: 'Standard Japanese closing courtesy' },
      { text: '日本語を勉強しています', pinyin: 'ni-hon-go o ben-kyō shi-te-i-ma-su', translation: 'I am studying Japanese', toneTip: 'Smooth particle o bridge and elongated kyō' },
      { text: 'どちらから来ましたか？', pinyin: 'do-chi-ra ka-ra ki-ma-shi-ta-ka?', translation: 'Where did you come from?', toneTip: 'Polite question inflection' },
    ],
  },
  {
    id: 'ja-n5-4',
    lang: 'ja',
    level: 'JLPT N5',
    title: 'Cafe & Restaurant Dining',
    description: 'Ordering drinks, meals and paying the bill',
    order: 4,
    phrases: [
      { text: 'コーヒーをひとつお願いします', pinyin: 'kō-hī o hi-to-tsu o-ne-ga-i-shi-ma-su', translation: 'One coffee, please', toneTip: 'Elongated vowels kō and hī with clean particle' },
      { text: 'お会計をお願いします', pinyin: 'o-ka-i-kei o o-ne-ga-i-shi-ma-su', translation: 'The check / bill please', toneTip: 'Natural restaurant phrase with clear diphthongs' },
      { text: 'とても美味しいです', pinyin: 'to-te-mo o-i-shī de-su', translation: "It's very delicious", toneTip: 'Emphasis on to-te-mo with drawn out shī' },
      { text: 'ごちそうさまでした', pinyin: 'go-chi-sō-sa-ma de-shi-ta', translation: 'Thank you for the meal', toneTip: 'Traditional after-meal appreciation phrase' },
    ],
  },
  {
    id: 'ja-n4-1',
    lang: 'ja',
    level: 'JLPT N4',
    title: 'Asking Directions & Trains',
    description: 'Find train stations, platforms and directions',
    order: 5,
    phrases: [
      { text: '駅はどこですか？', pinyin: 'e-ki wa do-ko de-su-ka?', translation: 'Where is the train station?', toneTip: 'Atamadaka accent on e-ki (high on e, low on ki)' },
      { text: '次の電車は何時ですか？', pinyin: 'tsu-gi no den-sha wa nan-ji de-su-ka?', translation: 'What time is the next train?', toneTip: 'Smooth cadence across noun compounds' },
      { text: 'まっすぐ行ってください', pinyin: 'mas-su-gu it-te ku-da-sa-i', translation: 'Please go straight ahead', toneTip: 'Distinct pauses on sokuon double consonants' },
      { text: 'ここから歩いて五分です', pinyin: 'ko-ko ka-ra a-ru-i-te go-fun de-su', translation: "It's a 5 minute walk from here", toneTip: 'Clear time phrase duration pronunciation' },
    ],
  },
  {
    id: 'ja-n4-2',
    lang: 'ja',
    level: 'JLPT N4',
    title: 'Invitations & Daily Schedule',
    description: 'Make plans with friends and comment on weather',
    order: 6,
    phrases: [
      { text: '明日一緒に映画を見ませんか？', pinyin: 'a-shi-ta is-sho ni e-i-ga o mi-ma-sen-ka?', translation: "Shall we watch a movie together tomorrow?", toneTip: 'Polite invitation with rising question ending' },
      { text: '今日の天気はとてもいいですね', pinyin: 'kyō no ten-ki wa to-te-mo ī de-su ne', translation: "The weather today is very nice, isn't it?", toneTip: 'Friendly confirmatory ne particle tone' },
      { text: '週末は友達と出かけます', pinyin: 'shū-ma-tsu wa to-mo-da-chi to de-ka-ke-ma-su', translation: 'I am going out with friends this weekend', toneTip: 'Even mora tempo without dropping particles' },
      { text: '何時に待ち合わせしましょうか？', pinyin: 'nan-ji ni ma-chi-a-wa-se shi-ma-shō-ka?', translation: 'What time shall we meet up?', toneTip: 'Soft consultative shō-ka intonation' },
    ],
  },
  {
    id: 'ja-n4-3',
    lang: 'ja',
    level: 'JLPT N4',
    title: 'Natural Nuances & Courtesies',
    description: 'Workplace and social phrases for natural fluency',
    order: 7,
    phrases: [
      { text: 'お疲れ様でした', pinyin: 'o-tsu-ka-re-sa-ma de-shi-ta', translation: 'Great work today / Thank you for your efforts', toneTip: 'Essential Japanese workplace acknowledgment' },
      { text: '大丈夫ですよ、気にしないで', pinyin: 'da-i-jō-bu de-su yo, ki ni shi-na-i-de', translation: "It's all right, don't worry about it", toneTip: 'Reassuring gentle pitch descent' },
      { text: 'また後で連絡しますね', pinyin: 'ma-ta a-to de ren-ra-ku shi-ma-su ne', translation: 'I will get in touch with you later', toneTip: 'Natural conversational promise cadence' },
      { text: '気をつけて帰ってください', pinyin: 'ki o tsu-ke-te ka-et-te ku-da-sa-i', translation: 'Please get home safely', toneTip: 'Warm caring farewell expression' },
    ],
  },

  // ==========================================
  // KOREAN — TOPIK I, II
  // ==========================================
  {
    id: 'ko-topik1-1',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Greetings & Politeness',
    description: 'Essential honorific greetings, thanks and departures',
    order: 1,
    phrases: [
      { text: '안녕하세요', pinyin: 'an-nyeong-ha-se-yo', translation: 'Hello / Good day', toneTip: 'Smooth rise on ha, gentle fall on se-yo' },
      { text: '반갑습니다', pinyin: 'ban-gap-seum-ni-da', translation: 'Nice to meet you', toneTip: 'Nasal assimilation on ㅂ+ㄴ → [ㅁㄴ]' },
      { text: '감사합니다', pinyin: 'gam-sa-ham-ni-da', translation: 'Thank you', toneTip: 'Clear batchim ㅁ closure before ㅅ' },
      { text: '죄송합니다', pinyin: 'joe-song-ham-ni-da', translation: "I'm sorry / Apologies", toneTip: 'Crisp initial ㅈ sound with polite ending' },
      { text: '안녕히 계세요', pinyin: 'an-nyeong-hi gye-se-yo', translation: 'Goodbye (when you are leaving)', toneTip: 'Distinct from 가세요 (used when other person leaves)' },
    ],
  },
  {
    id: 'ko-topik1-2',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Numbers & Shopping',
    description: 'Native & Sino Korean numbers, asking prices',
    order: 2,
    phrases: [
      { text: '하나, 둘, 셋, 넷', pinyin: 'ha-na, dul, set, net', translation: 'One, two, three, four (Native)', toneTip: 'Notice the crisp batchim stops on 셋, 넷' },
      { text: '일, 이, 삼, 사', pinyin: 'il, i, sam, sa', translation: '1, 2, 3, 4 (Sino-Korean)', toneTip: 'Used for money, minutes, phone numbers' },
      { text: '이거 얼마예요?', pinyin: 'i-geo eol-ma-ye-yo?', translation: 'How much is this?', toneTip: 'Rising question intonation on ye-yo' },
      { text: '이거 두 개 주세요', pinyin: 'i-geo du gae ju-se-yo', translation: 'Please give me two of these', toneTip: 'Native Korean counter pattern with 개' },
      { text: '조금 깎아주세요', pinyin: 'jo-geum kkak-a-ju-se-yo', translation: 'Please give a little discount', toneTip: 'Tense double consonant ㄲ sound' },
    ],
  },
  {
    id: 'ko-topik1-3',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Self-Introduction & Origins',
    description: 'Name, nationality and learning Korean',
    order: 3,
    phrases: [
      { text: '저는 민수라고 합니다', pinyin: 'jeo-neun Min-su-ra-go ham-ni-da', translation: 'My name is Minsu', toneTip: 'Polite humble pronoun 저는' },
      { text: '한국어를 배우고 있어요', pinyin: 'han-gu-geo-reul bae-u-go it-sseo-yo', translation: 'I am learning Korean', toneTip: 'Liaison sound linking 한국어 [한구거]' },
      { text: '만나서 정말 반가워요', pinyin: 'man-na-seo jeong-mal ban-ga-wo-yo', translation: 'Really wonderful to meet you', toneTip: 'Warm upbeat conversational rhythm' },
      { text: '어느 나라에서 오셨어요?', pinyin: 'eo-neu na-ra-e-seo o-syeot-sseo-yo?', translation: 'Which country are you from?', toneTip: 'Honorific past question ending 셨어요' },
    ],
  },
  {
    id: 'ko-topik1-4',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Cafe & Restaurant Dining',
    description: 'Order coffee, meals, side dishes and bills',
    order: 4,
    phrases: [
      { text: '아이스 아메리카노 한 잔 주세요', pinyin: 'a-i-seu a-me-ri-ka-no han jan ju-se-yo', translation: 'One iced Americano please', toneTip: 'Clear counter 한 잔 with smooth airflow' },
      { text: '이 음식 정말 맛있어요!', pinyin: 'i eum-sik jeong-mal mas-it-sseo-yo!', translation: 'This food is really delicious!', toneTip: 'Palatalization linking in 맛있어요 [마시써요]' },
      { text: '여기 계산해 주세요', pinyin: 'yeo-gi gye-san-hae ju-se-yo', translation: 'Check / bill here please', toneTip: 'Common Korean restaurant phrasing' },
      { text: '물 좀 더 주실 수 있나요?', pinyin: 'mul jom deo ju-sil su ing-na-yo?', translation: 'Could I get some more water please?', toneTip: 'Polite request pattern with nasal sound change' },
    ],
  },
  {
    id: 'ko-topik1-5',
    lang: 'ko',
    level: 'TOPIK I',
    title: 'Directions & Subway Transit',
    description: 'Find metro stations, exits and restrooms',
    order: 5,
    phrases: [
      { text: '화장실이 어디예요?', pinyin: 'hwa-jang-si-ri eo-di-ye-yo?', translation: 'Where is the restroom?', toneTip: 'Liaison linking 화장실이 [화장시리]' },
      { text: '저기요, 길 좀 여쭤볼게요', pinyin: 'jeo-gi-yo, gil jom yeo-jwo-bol-ge-yo', translation: 'Excuse me, may I ask for directions?', toneTip: 'Polite attention-getter 저기요' },
      { text: '지하철역이 어디에 있나요?', pinyin: 'ji-ha-cheol-yeo-gi eo-di-e ing-na-yo?', translation: 'Where is the subway station located?', toneTip: 'Aspirated ㅊ and ㅋ clarity' },
      { text: '여기서 걸어서 5분 걸려요', pinyin: 'yeo-gi-seo geor-eo-seo o-bun geol-lyeo-yo', translation: "It takes 5 minutes on foot from here", toneTip: 'Liquid consonant assimilation in 걸려요' },
    ],
  },
  {
    id: 'ko-topik2-1',
    lang: 'ko',
    level: 'TOPIK II',
    title: 'Daily Life & Weather',
    description: 'Talk about weather, weekends and invitations',
    order: 6,
    phrases: [
      { text: '오늘 날씨가 정말 화창하네요', pinyin: 'o-neul nal-ssi-ga jeong-mal hwa-chang-ha-ne-yo', translation: 'The weather today is truly sunny and clear', toneTip: 'Exclamatory mild ending ~네요' },
      { text: '내일 시간 있으시면 같이 밥 먹어요', pinyin: 'nae-il si-gan it-sseu-si-myeon gat-i bap meog-eo-yo', translation: 'If you have time tomorrow, let us eat together', toneTip: 'Palatalization in 같이 [가치]' },
      { text: '이번 주말에 보통 뭐 하세요?', pinyin: 'i-beon ju-ma-re bo-tong mwo ha-se-yo?', translation: 'What do you usually do on weekends?', toneTip: 'Friendly natural inquiry cadence' },
      { text: '다음 주에 같이 전시회 보러 갈래요?', pinyin: 'da-eum ju-e gat-i jeon-si-hoe bo-reo gal-lae-yo?', translation: 'Would you like to go to an exhibition together next week?', toneTip: 'Suggestive proposal ending ~갈래요?' },
    ],
  },
  {
    id: 'ko-topik2-2',
    lang: 'ko',
    level: 'TOPIK II',
    title: 'Natural Reactions & Encouragement',
    description: 'Express relief, encouragement and warm goodbyes',
    order: 7,
    phrases: [
      { text: '정말 다행이에요, 걱정하지 마세요', pinyin: 'jeong-mal da-haeng-i-e-yo, geok-jeong-ha-ji ma-se-yo', translation: 'What a relief, please do not worry', toneTip: 'Comforting, gentle intonation curve' },
      { text: '오늘 하루도 수고 많으셨어요', pinyin: 'o-neul ha-ru-do su-go man-eu-syeot-sseo-yo', translation: 'You worked very hard today as well', toneTip: 'Deeply polite end-of-day recognition' },
      { text: '언제나 응원하고 있을게요, 힘내세요!', pinyin: 'eon-je-na eung-won-ha-go it-sseul-ge-yo, him-nae-se-yo!', translation: 'Always rooting for you, stay strong!', toneTip: 'Upbeat encouraging warmth' },
      { text: '조심히 들어가시고 다음에 또 봬요', pinyin: 'jo-sim-hi deu-reo-ga-si-go da-eum-e tto bwae-yo', translation: 'Get home safely and see you next time', toneTip: 'Traditional Korean polite parting wish' },
    ],
  },
]

export function getLessonsByLang(lang: string): Lesson[] {
  return lessons.filter((l) => l.lang === lang).sort((a, b) => a.order - b.order)
}

export function isLessonUnlocked(lesson: Lesson, completed: string[]): boolean {
  const langLessons = getLessonsByLang(lesson.lang)
  const index = langLessons.findIndex((l) => l.id === lesson.id)
  if (index <= 0) return true
  const prevLesson = langLessons[index - 1]
  return completed.includes(prevLesson.id)
}
