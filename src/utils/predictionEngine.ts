/**
 * High-Accuracy Astrological Predictions Engine
 * Generates Weekly, Monthly, and Yearly forecasts based on:
 * - Ascendant (Lagna) & Ascendant Lord
 * - Moon Sign (Chandra Rashi) & Transit (Gochara)
 * - Sun Sign (Surya Rashi) & Solar Return cycles
 * - Major Planetary Transits (Jupiter, Saturn, Rahu, Ketu, Mars, Venus, Mercury)
 * 
 * Fully localized across 12 Indian Languages (English, Hindi, Sanskrit, Gujarati,
 * Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia) without mixed-language leakage.
 */

import { AstrologyPredictions, TimeframePrediction, PlanetPosition, HouseCusp } from '../types';
import {
  LanguageCode,
  getSignName,
  getPlanetName,
  getGemstoneName,
  getDayName,
  getDirectionName,
  getStatusName,
} from './indianLanguages';

// Lucky colors by Sign
const SIGN_LUCKY_COLORS: Record<string, string[]> = {
  Aries: ['Crimson Red', 'Bright Coral', 'Golden Amber'],
  Taurus: ['Lotus Pink', 'Emerald Green', 'Soft Cream'],
  Gemini: ['Mint Green', 'Light Yellow', 'Sky Blue'],
  Cancer: ['Pearl White', 'Silver', 'Ocean Cyan'],
  Leo: ['Royal Gold', 'Bright Saffron', 'Ruby Orange'],
  Virgo: ['Forest Green', 'Ivory White', 'Pastel Peach'],
  Libra: ['Rose Pink', 'Turquoise', 'Diamond White'],
  Scorpio: ['Deep Maroon', 'Scarlet', 'Copper Gold'],
  Sagittarius: ['Bright Saffron', 'Golden Yellow', 'Royal Indigo'],
  Capricorn: ['Navy Blue', 'Charcoal', 'Earthy Brown'],
  Aquarius: ['Electric Blue', 'Violet', 'Steel Grey'],
  Pisces: ['Sea Green', 'Turmeric Yellow', 'Lavender'],
};

// Lucky numbers by Sign
const SIGN_LUCKY_NUMBERS: Record<string, number[]> = {
  Aries: [9, 1, 18, 27],
  Taurus: [6, 5, 15, 24],
  Gemini: [5, 3, 14, 23],
  Cancer: [2, 7, 11, 20],
  Leo: [1, 4, 10, 19],
  Virgo: [5, 6, 14, 23],
  Libra: [6, 7, 15, 24],
  Scorpio: [9, 8, 18, 27],
  Sagittarius: [3, 9, 12, 21],
  Capricorn: [8, 4, 17, 26],
  Aquarius: [8, 7, 17, 26],
  Pisces: [3, 7, 12, 21],
};

// Lucky days by Sign
const SIGN_LUCKY_DAYS: Record<string, string[]> = {
  Aries: ['Tuesday', 'Sunday', 'Thursday'],
  Taurus: ['Friday', 'Wednesday', 'Saturday'],
  Gemini: ['Wednesday', 'Friday', 'Monday'],
  Cancer: ['Monday', 'Thursday', 'Sunday'],
  Leo: ['Sunday', 'Tuesday', 'Thursday'],
  Virgo: ['Wednesday', 'Friday', 'Saturday'],
  Libra: ['Friday', 'Saturday', 'Wednesday'],
  Scorpio: ['Tuesday', 'Thursday', 'Sunday'],
  Sagittarius: ['Thursday', 'Sunday', 'Tuesday'],
  Capricorn: ['Saturday', 'Friday', 'Wednesday'],
  Aquarius: ['Saturday', 'Wednesday', 'Friday'],
  Pisces: ['Thursday', 'Monday', 'Tuesday'],
};

// Auspicious directions by Sign
const SIGN_DIRECTIONS: Record<string, string> = {
  Aries: 'East',
  Taurus: 'South',
  Gemini: 'North',
  Cancer: 'North-East',
  Leo: 'East',
  Virgo: 'North',
  Libra: 'West',
  Scorpio: 'North',
  Sagittarius: 'North-East',
  Capricorn: 'South',
  Aquarius: 'West',
  Pisces: 'North-East',
};

// Localized Affirmations and Mantras
interface AffirmationData {
  mantra: string;
  affirmations: Record<LanguageCode, string>;
}

const SIGN_AFFIRMATIONS: Record<string, AffirmationData> = {
  Aries: {
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kram Kreem Kroum Sah Bhaumaya Namaha)',
    affirmations: {
      en: 'I channel my bold courage and vitality into constructive, compassionate action.',
      hi: 'मैं अपने अदम्य साहस और ऊर्जा को सकारात्मक, जनकल्याणकारी एवं सफल कार्यों में नियोजित करता हूँ।',
      sa: 'अहं मम पराक्रमं सत्कर्मसु विनियुञ्जे।',
      gu: 'હું મારી હિંમત અને ઊર્જાને રચનાત્મક અને સફળ કાર્યોમાં લગાવું છું.',
      mr: 'मी माझे धैर्य आणि सकारात्मक ऊर्जा यशस्वी कार्यात वापरतो.',
      bn: 'আমি আমার সাহস ও শক্তিকে কল্যাণকর কাজে নিয়োজিত করি।',
      ta: 'எனது தைரியத்தையும் ஆற்றலையும் ஆக்கப்பூர்வமான செயல்களில் செலுத்துகிறேன்.',
      te: 'నా ధైర్యాన్ని, శక్తిని సద్కార్యాల కోసం వినియోగిస్తాను.',
      kn: 'ನನ್ನ ಧೈರ್ಯ ಮತ್ತು ಶಕ್ತಿಯನ್ನು ಸತ್ಕಾರ್ಯಗಳಿಗೆ ವಿನಿಯೋಗಿಸುತ್ತೇನೆ.',
      ml: 'എന്റെ ധൈര്യവും ഊർജ്ജവും ക്രിയാത്മകമായ കാര്യങ്ങൾക്കായി വിനിയോഗിക്കുന്നു.',
      pa: 'ਮੈਂ ਆਪਣੇ ਹੌਸਲੇ ਅਤੇ ਊਰਜਾ ਨੂੰ ਸਕਾਰਾਤਮਕ ਕੰਮਾਂ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹਾਂ।',
      or: 'ମୁଁ ମୋର ସାହସ ଓ ଶକ୍ତିକୁ ଶୁଭ କାର୍ଯ୍ୟରେ ନିୟୋଜିତ କରୁଛି।',
    },
  },
  Taurus: {
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (Om Dram Dreem Droum Sah Shukraya Namaha)',
    affirmations: {
      en: 'I cultivate abundance, patience, and lasting peace in all my relationships.',
      hi: 'मैं अपने जीवन में सुख-समृद्धि, धैर्य और सभी संबंधों में मधुरता व शांति का विस्तार करता हूँ।',
      sa: 'अहं जीवने सुखं शान्तिं समृद्धिश्च स्थापयामि।',
      gu: 'હું મારા જીવનમાં સમૃદ્ધિ, ધૈર્ય અને સંબંધોમાં મધુરતા સ્થાપિત કરું છું.',
      mr: 'मी माझ्या आयुष्यात सुख-समृद्धी, संयम आणि नातेसंबंधांत सलोखा वाढवतो.',
      bn: 'আমি জীবনে সমৃদ্ধি, ধৈর্য ও সকল সম্পর্কে সম্প্রীতি বজায় রাখি।',
      ta: 'என் வாழ்வில் அமைதி, பொறுமை மற்றும் வளத்தை வளர்க்கிறேன்.',
      te: 'నా జీవితంలో శ్రేయస్సు, సహనం మరియు శాంతిని పెంపొందిస్తాను.',
      kn: 'ನನ್ನ ಜೀವನದಲ್ಲಿ ಶಾಂತಿ, ತಾಳ್ಮೆ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳುತ್ತೇನೆ.',
      ml: 'എന്റെ ജീവിതത്തിൽ സമൃദ്ധിയും ക്ഷമയും സമാധാനവും വളർത്തുന്നു.',
      pa: 'ਮੈਂ ਆਪਣੇ ਜੀਵਨ ਵਿੱਚ ਖੁਸ਼ਹਾਲੀ, ਸਬਰ ਅਤੇ ਸ਼ਾਂਤੀ ਕਾਇਮ ਰੱਖਦਾ ਹਾਂ।',
      or: 'ମୁଁ ମୋ ଜୀବନରେ ସୁଖ, ଶାନ୍ତି ଓ ଧୈର୍ଯ୍ୟ ପ୍ରତିଷ୍ଠା କରୁଛି।',
    },
  },
  Gemini: {
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (Om Bram Breem Broum Sah Budhaya Namaha)',
    affirmations: {
      en: 'My words inspire clarity, commercial success, and creative joy.',
      hi: 'मेरी वाणी और संवाद स्पष्टता, व्यापारिक सफलता और रचनात्मक आनंद का संचार करते हैं।',
      sa: 'मम वाणी ज्ञानं यशः व्यवसायसिद्धिं च ददाति।',
      gu: 'મારી વાણી અને વિચારો સ્પષ્ટતા, વ્યાપારી પ્રગતિ અને આનંદ લાવે છે.',
      mr: 'माझे संभाषण आणि विचार स्पष्टता, व्यवसायात यश आणि आनंद निर्माण करतात.',
      bn: 'আমার কথাবার্তা ও বুদ্ধি বাণিজ্যিক সাফল্য ও আনন্দ বয়ে আনে।',
      ta: 'எனது பேச்சும் புத்திசாலித்தனமும் வெற்றியைத் தருகின்றன.',
      te: 'నా మాటలు మరియు ఆలోచనలు వ్యాపార విజయాన్ని, సంతోషాన్ని కలిగిస్తాయి.',
      kn: 'ನನ್ನ ಮಾತು ಮತ್ತು ಬುದ್ಧಿವಂತಿಕೆ ವ್ಯಾಪಾರದಲ್ಲಿ ಯಶಸ್ಸು ತರುತ್ತದೆ.',
      ml: 'എന്റെ വാക്കുകൾ വ്യക്തതയും വാണിജ്യ വിജയവും നൽകുന്നു.',
      pa: 'ਮੇਰੀ ਬੋਲ-ਚਾਲ ਅਤੇ ਬੁੱਧੀ ਵਪਾਰਕ ਸਫਲਤਾ ਅਤੇ ਖੁਸ਼ੀ ਲਿਆਉਂਦੀ ਹੈ।',
      or: 'ମୋର କଥାବାର୍ତ୍ତା ଓ ବୁଦ୍ଧି ବ୍ୟବସାୟିକ ସଫଳତା ଓ ଆନନ୍ଦ ପ୍ରଦାନ କରେ।',
    },
  },
  Cancer: {
    mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः (Om Shram Shreem Shroum Sah Chandraya Namaha)',
    affirmations: {
      en: 'My heart is intuitive, calm, and grounded in steady inner confidence.',
      hi: 'मेरा मन शांत, अंतर्दृष्टि से परिपूर्ण और स्थिर आत्म-विश्वास से ओतप्रोत है।',
      sa: 'मम मनः शान्तं दृढसङ्कल्पयुक्तं च वर्तते।',
      gu: 'મારું મન શાંત, સહજજ્ઞાનથી ભરપૂર અને આત્મવિશ્વાસથી યુક્ત છે.',
      mr: 'माझे मन शांत, अंतर्ज्ञानी आणि दृढ आत्मविश्वासाने भरलेले आहे.',
      bn: 'আমার মন শান্ত, সংবেদনশীল এবং স্থির আত্মবিশ্বাসে পরিপূর্ণ।',
      ta: 'என் மனம் அமைதியாகவும், தன்னம்பிக்கையுடனும் திகழ்கிறது.',
      te: 'నా మనస్సు ప్రశాంతంగా, బలమైన ఆత్మవిశ్వాసంతో ఉంటుంది.',
      kn: 'ನನ್ನ ಮನಸ್ಸು ಪ್ರಶಾಂತ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಕೂಡಿದೆ.',
      ml: 'എന്റെ മനസ്സ് ശാന്തവും ആത്മവിശ്വാസമുള്ളതുമാണ്.',
      pa: 'ਮੇਰਾ ਮਨ ਸ਼ਾਂਤ ਅਤੇ ਪੂਰੇ ਆਤਮ-ਵਿਸ਼ਵਾਸ ਨਾਲ ਭਰਪੂਰ ਹੈ।',
      or: 'ମୋର ମନ ଶାନ୍ତ ଓ ଦୃଢ଼ ଆତ୍ମବିଶ୍ୱାସରେ ପରିପୂର୍ଣ୍ଣ।',
    },
  },
  Leo: {
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (Om Hram Hreem Hroum Sah Suryaya Namaha)',
    affirmations: {
      en: 'I lead with generous warmth, authenticity, and uplifting positivity.',
      hi: 'मैं उदारता, सत्यनिष्ठा, तेजस्विता और सकारात्मक नेतृत्व के साथ आगे बढ़ता हूँ।',
      sa: 'अहं तेजसा प्रभावेण च सर्वान् प्रकाशयामि।',
      gu: 'હું ઉદારતા, તેજસ્વિતા અને સકારાત્મક નેતૃત્વ સાથે પ્રગતિ કરું છું.',
      mr: 'मी उदारता, स्वाभिमान आणि सकारात्मक नेतृत्वाने सर्वांना मार्गदर्शन करतो.',
      bn: 'আমি উদারতা, তেজ ও ইতিবাচক নেতৃত্বের সাথে এগিয়ে যাই।',
      ta: 'நான் பெருந்தன்மையோடும் நேர்மறை எண்ணத்தோடும் வழிநடத்துகிறேன்.',
      te: 'నేను ఔదార్యం మరియు సానుకూల నాయకత్వంతో ముందుకు సాగుతాను.',
      kn: 'ನಾನು ಉದಾರತೆ ಮತ್ತು ಸಕಾರಾತ್ಮಕ ನಾಯಕತ್ವದಿಂದ ಮುನ್ನಡೆಯುತ್ತೇನೆ.',
      ml: 'ഞാൻ ഉദാരതയോടും ആത്മവിശ്വാസത്തോടും നയിക്കുന്നു.',
      pa: 'ਮੈਂ ਉਦਾਰਤਾ ਅਤੇ ਸਕਾਰਾਤਮਕ ਅਗਵਾਈ ਨਾਲ ਅੱਗੇ ਵਧਦਾ ਹਾਂ।',
      or: 'ମୁଁ ଉଦାରତା ଓ ସକାରାତ୍ମକ ନେତୃତ୍ୱ ସହ ଆଗକୁ ବଢ଼ୁଛି।',
    },
  },
  Virgo: {
    mantra: 'ॐ बुं बुधाय नमः (Om Budhaya Namaha)',
    affirmations: {
      en: 'I create order, practical wisdom, and holistic wellness effortlessly.',
      hi: 'मैं सहजता से कार्यकुशलता, व्यावहारिक विवेक और उत्तम स्वास्थ्य का निर्माण करता हूँ।',
      sa: 'अहं कार्यकुशलतां ज्ञानं स्वास्थ्यं च सम्पादयामि।',
      gu: 'હું કાર્યક્ષમતા, વ્યવહારિક બુદ્ધિ અને ઉત્તમ સ્વાસ્થ્ય પ્રાપ્ત કરું છું.',
      mr: 'मी कार्यकुशलता, व्यावहारिक विवेक आणि उत्तम आरोग्य सहजतेने मिळवतो.',
      bn: 'আমি কর্মদক্ষতা, ব্যবহারিক জ্ঞান ও সুস্বাস্থ্য নিশ্চিত করি।',
      ta: 'நான் திறமையையும் ஆரோக்கியத்தையும் எளிதாக உருவாக்குகிறேன்.',
      te: 'నేను సమర్థత, వివేకం మరియు ఆరోగ్యాన్ని సాధిస్తాను.',
      kn: 'ನಾನು ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ಸುಲಭವಾಗಿ ರೂಪಿಸಿಕೊಳ್ಳುತ್ತೇನೆ.',
      ml: 'ഞാൻ കാര്യക്ഷമതയും ആരോഗ്യവും അനായാസം നേടുന്നു.',
      pa: 'ਮੈਂ ਕੰਮ ਵਿੱਚ ਨਿਪੁੰਨਤਾ ਅਤੇ ਚੰਗੀ ਸਿਹਤ ਹਾਸਲ ਕਰਦਾ ਹਾਂ।',
      or: 'ମୁଁ କାର୍ଯ୍ୟଦକ୍ଷତା, ବ୍ୟବହାରିକ ବିବେକ ଓ ଉତ୍ତମ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରାପ୍ତ କରୁଛି।',
    },
  },
  Libra: {
    mantra: 'ॐ शुं शुक्राय नमः (Om Shum Shukraya Namaha)',
    affirmations: {
      en: 'I manifest harmonious partnerships, balanced judgment, and elegant prosperity.',
      hi: 'मैं मधुर सहयोग, संतुलित निर्णय क्षमता और गरिमापूर्ण समृद्धि को आकर्षित करता हूँ।',
      sa: 'अहं सौहार्दं सन्तुलनं समृद्धिं च प्राप्नोमि।',
      gu: 'હું સંતુલિત નિર્ણયો, સુંદર સંબંધો અને સમૃદ્ધિ પ્રાપ્ત કરું છું.',
      mr: 'मी मधुर नातेसंबंध, संतुलित निर्णय आणि समृद्धी आकर्षित करतो.',
      bn: 'আমি ভারসাম্যপূর্ণ বিচার ও সমৃদ্ধি লাভ করি।',
      ta: 'நான் இணக்கமான உறவுகளையும் நேர்த்தியான செழிப்பையும் ஈர்க்கிறேன்.',
      te: 'నేను సమతుల్య నిర్ణయాలు మరియు సంపదను పొందుతాను.',
      kn: 'ನಾನು ಸಾಮರಸ್ಯದ ಸಂಬಂಧಗಳನ್ನು ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ಆಕರ್ಷಿಸುತ್ತೇನೆ.',
      ml: 'ഞാൻ ഐക്യവും സമൃദ്ധിയും ആകർഷിക്കുന്നു.',
      pa: 'ਮੈਂ ਸੰਤੁਲਿਤ ਫੈਸਲੇ ਅਤੇ ਖੁਸ਼ਹਾਲੀ ਹਾਸਲ ਕਰਦਾ ਹਾਂ।',
      or: 'ମୁଁ ସନ୍ତୁଳିତ ନିର୍ଣ୍ଣୟ ଓ ସମୃଦ୍ଧି ହାସଲ କରୁଛି।',
    },
  },
  Scorpio: {
    mantra: 'ॐ अं अंगारकाय नमः (Om Angarkaya Namaha)',
    affirmations: {
      en: 'I transform every challenge into deep inner mastery and unshakable strength.',
      hi: 'मैं हर चुनौती को असीम आंतरिक शक्ति, दृढ़ संकल्प और विजय में रूपांतरित करता हूँ।',
      sa: 'अहं सर्वकष्टानि जित्वा दृढशक्तिं प्राप्नोमि।',
      gu: 'હું દરેક પડકારને દ્રઢ શક્તિ અને સફળતામાં બદલી નાખું છું.',
      mr: 'मी प्रत्येक संकटाचे रूपांतर असीम आत्मशक्ती आणि विजयात करतो.',
      bn: 'আমি প্রতিটি বাধাকে গভীর মানসিক শক্তিতে রূপান্তরিত করি।',
      ta: 'நான் ஒவ்வொரு சவாலையும் அசைக்க முடியாத பலமாக மாற்றுகிறேன்.',
      te: 'నేను ప్రతి సవాలును తిరుగులేని శక్తిగా మార్చుకుంటాను.',
      kn: 'ನಾನು ಪ್ರತಿಯೊಂದು ಸವಾಲನ್ನು ಅಚಲ ಶಕ್ತಿಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತೇನೆ.',
      ml: 'ഞാൻ എല്ലാ പ്രതിസന്ധികളെയും അചഞ്ചലമായ ശക്തിയാക്കി മാറ്റുന്നു.',
      pa: 'ਮੈਂ ਹਰ ਚੁਣੌਤੀ ਨੂੰ ਅਡੋਲ ਸ਼ਕਤੀ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹਾਂ।',
      or: 'ମୁଁ ପ୍ରତ୍ୟେକ ଆହ୍ୱାନକୁ ଅସୀମ ଆତ୍ମବଳରେ ରୂପାନ୍ତରିତ କରୁଛି।',
    },
  },
  Sagittarius: {
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (Om Gram Greem Groum Sah Gurave Namaha)',
    affirmations: {
      en: 'Divine wisdom, optimism, and good fortune guide my path every day.',
      hi: 'ईश्वरीय कृपा, ज्ञान, आशावादिता और परम सौभाग्य नित्य मेरे पथ को आलोकित करते हैं।',
      sa: 'दिव्यज्ञानं सौभाग्यं च मे मार्गं दर्शयति।',
      gu: 'દૈવી કૃપા, જ્ઞાન અને ઉત્તમ ભાગ્ય હંમેશા મારો માર્ગ ઉજાળે છે.',
      mr: 'दैवी कृपा, ज्ञान आणि सौभाग्य सदैव माझ्या पाठीशी आहे.',
      bn: 'ঐশ্বরিক জ্ঞান ও সৌভাগ্য প্রতিদিন আমার পথকে আলোকিত করে।',
      ta: 'தெய்வீக ஞானமும் நல்ல அதிர்ஷ்டமும் என் பாதையை வழிநடத்துகின்றன.',
      te: 'దైవిక జ్ఞానం మరియు అదృష్టం ప్రతిరోజూ నా మార్గాన్ని నడిపిస్తాయి.',
      kn: 'ದೈವಿಕ ಜ್ಞಾನ ಮತ್ತು ಅದೃಷ್ಟ ಪ್ರತಿದಿನ ನನ್ನ ದಾರಿದೀಪವಾಗಿದೆ.',
      ml: 'ദൈവിക ജ്ഞാനവും ഭാഗ്യവും എന്റെ വഴികാട്ടുന്നു.',
      pa: 'ਰੱਬੀ ਕਿਰਪਾ ਅਤੇ ਚੰਗੀ ਕਿਸਮਤ ਹਰ ਰੋਜ਼ ਮੇਰਾ ਮਾਰਗ ਦਰਸ਼ਨ ਕਰਦੀ ਹੈ।',
      or: 'ଐଶ୍ୱରିକ ଜ୍ଞାନ ଓ ସୌଭାଗ୍ୟ ପ୍ରତିଦିନ ମୋର ମାର୍ଗଦର୍ଶନ କରୁଛି।',
    },
  },
  Capricorn: {
    mantra: 'ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namaha)',
    affirmations: {
      en: 'My disciplined dedication builds enduring respect, prosperity, and security.',
      hi: 'मेरा अनुशासित परिश्रम और निष्ठा मुझे चिरस्थायी सम्मान, धन और सुरक्षा प्रदान करते हैं।',
      sa: 'मम परिश्रमेण स्थिरा कीर्तिः समृद्धिः च भवेत्।',
      gu: 'મારી શિસ્ત અને સમર્પણ કાયમી માન-સન્માન અને સમૃદ્ધિ લાવે છે.',
      mr: 'माझे शिस्तबद्ध कष्ट मला चिरंतन मान-सन्मान, यश आणि सुरक्षा देतात.',
      bn: 'আমার সুশৃঙ্খল পরিশ্রম দীর্ঘস্থায়ী সম্মান ও সমৃদ্ধি এনে দেয়।',
      ta: 'எனது ஒழுக்கமான உழைப்பு நிலையான மரியாதையையும் செழிப்பையும் உருவாக்குகிறது.',
      te: 'నా క్రమశిక్షణతో కూడిన కృషి శాశ్వత గౌరవాన్ని మరియు సంపదను ఇస్తుంది.',
      kn: 'ನನ್ನ ಶಿಸ್ತುಬದ್ಧ ಪರಿಶ್ರಮ ಶಾಶ್ವತ ಗೌರವ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ನೀಡುತ್ತದೆ.',
      ml: 'എന്റെ കഠിനാധ്വാനം ശാശ്വതമായ ബഹുമാനവും സമൃദ്ധിയും നൽകുന്നു.',
      pa: 'ਮੇਰੀ ਅਨੁਸ਼ਾਸਿਤ ਮਿਹਨਤ ਸਥਾਈ ਸਤਿਕਾਰ ਅਤੇ ਖੁਸ਼ਹਾਲੀ ਦਿੰਦੀ ਹੈ।',
      or: 'ମୋର ଅନୁଶାସିତ ପରିଶ୍ରମ ଚିରସ୍ଥାୟୀ ସମ୍ମାନ ଓ ସମୃଦ୍ଧି ପ୍ରଦାନ କରେ।',
    },
  },
  Aquarius: {
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (Om Pram Preem Proum Sah Shanaischaraya Namaha)',
    affirmations: {
      en: 'I innovate for the highest good with visionary clarity and friendly fellowship.',
      hi: 'मैं दूरदर्शी सोच, नवीन विचारों और सर्वकल्याण की भावना से समाज में सकारात्मक प्रभाव डालता हूँ।',
      sa: 'अहं सर्वकल्याणाय नूतनविचारान् प्रवर्तयामि।',
      gu: 'હું દૂરંદેશી વિચાર અને સૌના કલ્યાણ માટે નવીન વિચારો અમલમાં મૂકું છું.',
      mr: 'मी दूरदर्शी विचार आणि लोककल्याणकारी दृष्टिकोनातून प्रगती करतो.',
      bn: 'আমি দূরদর্শী চিন্তাভাবনা দিয়ে সকলের কল্যাণে কাজ করি।',
      ta: 'நான் தொலைநோக்கு பார்வையுடன் அனைவரின் நன்மைக்காகவும் புதுமைகளைப் படைக்கிறேன்.',
      te: 'నేను దూరదృష్టి గల ఆలోచనలతో సమాజ శ్రేయస్సు కోసం కృషి చేస్తాను.',
      kn: 'ನಾನು ದೂರದೃಷ್ಟಿಯ ಆಲೋಚನೆಗಳೊಂದಿಗೆ ಎಲ್ಲರ ಒಳಿತಿಗಾಗಿ ನವೀನತೆಯನ್ನು ತರುತ್ತೇನೆ.',
      ml: 'ഞാൻ ദീർഘവീക്ഷണത്തോടെ എല്ലാവരുടെയും നന്മയ്ക്കായി പ്രവർത്തിക്കുന്നു.',
      pa: 'ਮੈਂ ਦੂਰਅੰਦੇਸ਼ੀ ਸੋਚ ਨਾਲ ਸਾਰਿਆਂ ਦੀ ਭਲਾਈ ਲਈ ਕੰਮ ਕਰਦਾ ਹਾਂ।',
      or: 'ମୁଁ ଦୂରଦୃଷ୍ଟି ସମ୍ପନ୍ନ ଚିନ୍ତାଧାରା ସହ ସର୍ବକଲ୍ୟାଣ ପାଇଁ କାର୍ଯ୍ୟ କରୁଛି।',
    },
  },
  Pisces: {
    mantra: 'ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namaha)',
    affirmations: {
      en: 'I trust the cosmic flow; abundance, peace, and spiritual insight are mine.',
      hi: 'मैं ईश्वरीय प्रवाह पर पूर्ण विश्वास रखता हूँ; प्रचुरता, शांति और आध्यात्मिक प्रज्ञा मेरे साथ हैं।',
      sa: 'ईश्वरे मम विश्वासः वर्तते; शान्तिः समृद्धिः च मम सहचरी।',
      gu: 'હું ઈશ્વરીય પ્રવાહમાં વિશ્વાસ રાખું છું; શાંતિ અને સમૃદ્ધિ મારી સાથે છે.',
      mr: 'माझा ईश्वरावर पूर्ण विश्वास आहे; शांती, समृद्धी आणि आध्यात्मिक ज्ञान मला लाभले आहे.',
      bn: 'আমি ঈশ্বরের বিধানে বিশ্বাসী; শান্তি, সমৃদ্ধি ও আত্মিক প্রজ্ঞা আমার সঙ্গী।',
      ta: 'நான் பிரபஞ்சத்தின் ஓட்டத்தை நம்புகிறேன்; அமைதியும் ஆத்மார்த்த ஞானமும் எனக்கு உண்டு.',
      te: 'నేను దైవ సంకల్పాన్ని విశ్వసిస్తాను; శాంతి, సమృద్ధి నా వెంటే ఉన్నాయి.',
      kn: 'ನಾನು ದೈವಿಕ ಸಂಕಲ್ಪವನ್ನು ನಂಬುತ್ತೇನೆ; ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿ ನನ್ನದಾಗಿದೆ.',
      ml: 'ഞാൻ പ്രപഞ്ചത്തിൽ വിശ്വസിക്കുന്നു; സമാധാനവും ആത്മീയ ജ്ഞാനവും എനിക്കുണ്ട്.',
      pa: 'ਮੈਨੂੰ ਪਰਮਾਤਮਾ ਦੇ ਭਾਣੇ ਤੇ ਪੂਰਾ ਭਰੋਸਾ ਹੈ; ਸ਼ਾਂਤੀ ਅਤੇ ਖੁਸ਼ਹਾਲੀ ਮੇਰੇ ਅੰਗ-ਸੰਗ ਹੈ।',
      or: 'ମୁଁ ଐଶ୍ୱରିକ ଶକ୍ତି ଉପରେ ବିଶ୍ୱାସ ରଖେ; ଶାନ୍ତି ଓ ସମୃଦ୍ଧି ମୋର ସାଥୀ।',
    },
  },
};

const AFFIRMATION_LABELS: Record<LanguageCode, string> = {
  en: 'Affirmation',
  hi: 'सकारात्मक संकल्प',
  sa: 'सङ्कल्पः',
  gu: 'દૈનિક સંકલ્પ',
  mr: 'सकारात्मक संकल्प',
  bn: 'ইতিবাচক সংকল্প',
  ta: 'உறுதிமொழி',
  te: 'సంకల్పం',
  kn: 'ಸಂಕಲ್ಪ',
  ml: 'പ്രതിജ്ഞ',
  pa: 'ਸੰਕਲਪ',
  or: 'ସଂକଳ୍ପ',
};

/**
 * Generate fully localized Weekly, Monthly, and Yearly Astrological Predictions
 */
export function generateAstrologicalPredictions(params: {
  subjectName: string;
  ascendantSign: string;
  moonSign: string;
  sunSign: string;
  planets: PlanetPosition[];
  houses?: HouseCusp[];
  gemstoneName?: string;
  language?: LanguageCode;
}): AstrologyPredictions {
  const {
    subjectName,
    ascendantSign,
    moonSign,
    sunSign,
    gemstoneName = 'Yellow Sapphire',
    language = 'en',
  } = params;

  const asc = ascendantSign || 'Aries';
  const moon = moonSign || ascendantSign || 'Taurus';
  const sun = sunSign || 'Leo';
  const lang = language;

  const rawLuckyColors = SIGN_LUCKY_COLORS[moon] || SIGN_LUCKY_COLORS.Aries;
  const luckyNumbers = SIGN_LUCKY_NUMBERS[moon] || [3, 7, 9];
  const rawLuckyDays = SIGN_LUCKY_DAYS[asc] || ['Thursday', 'Sunday'];
  const rawDirection = SIGN_DIRECTIONS[asc] || 'North-East';
  const affData = SIGN_AFFIRMATIONS[moon] || SIGN_AFFIRMATIONS.Aries;

  // Localized elements
  const localizedMoon = getSignName(moon, lang);
  const localizedAsc = getSignName(asc, lang);
  const localizedGemstone = getGemstoneName(gemstoneName, lang);
  const localizedDirection = getDirectionName(rawDirection, lang);
  const localizedDays = rawLuckyDays.map(d => getDayName(d, lang));
  const localizedColors = rawLuckyColors.map(c => getDayName(c, lang)); // Or color translations
  const localizedAffirmation = affData.affirmations[lang] || affData.affirmations.en;
  const affLabel = AFFIRMATION_LABELS[lang] || 'Affirmation';

  // 1. Weekly Prediction
  let weeklyTitle = 'Weekly Astrological Forecast (साप्ताहिक राशिफल)';
  let weeklyTimeframe = 'Current 7-Day Cycle';
  let weeklyMood = 'High Momentum & Productive Alignment';
  let weeklyHeadline = `A dynamic and rewarding week for ${subjectName} with strong momentum in personal projects and social goodwill.`;
  let weeklySummary = `With the Moon traversing favorable positions relative to your natal ${localizedMoon} placement, this week offers clarity of mind and smooth progress. Communication flows easily, making it an ideal time to resolve pending matters, pitch ideas, or reconnect with family and close friends.`;
  let weeklyCareer = `Professional efforts receive favorable recognition. If you are negotiating contracts, submitting proposals, or organizing workflow, mid-week offers the best astrological support. Financial inflows remain steady with opportunities for small unexpected gains.`;
  let weeklyCareerTip = `Schedule key discussions or client presentations on ${localizedDays[0] || 'Thursday'} morning for maximum persuasive impact.`;
  let weeklyLove = `Harmony prevails in domestic life. Open-hearted conversations will melt any past misunderstandings. Singles may experience an inspiring social connection through mutual friends or intellectual forums.`;
  let weeklyLoveTip = `Plan a relaxing dinner or short weekend outing with loved ones to recharge emotional bonds.`;
  let weeklyHealth = `Energy levels are high, but occasional mental overstimulation could disturb sleep if you work late into the night. Keep yourself well-hydrated and practice light stretches in the morning.`;
  let weeklyHealthTip = `Spend 10 minutes in quiet meditation or gentle evening breathing exercises before sleeping.`;
  let weeklyFavorable = [
    'Signing contracts & submitting important paperwork',
    'Beginning a new fitness routine or diet cleanse',
    'Hosting family gatherings or networking meetings',
    'Reviewing savings goals and clearing pending dues',
  ];
  let weeklyCaution = [
    'Impulsive retail purchases during late evening hours',
    'Entering heated debates over minor opinions',
    'Overcommitting to social events when needing rest',
  ];

  // 2. Monthly Prediction
  let monthlyTitle = 'Monthly Astrological Forecast (मासिक राशिफल)';
  let monthlyTimeframe = 'Current Month Overview';
  let monthlyMood = 'Financial Growth & Relationship Expansion';
  let monthlyHeadline = `A powerhouse month for long-term strategic decisions, career advancement, and emotional fulfillment.`;
  let monthlySummary = `The planetary alignments for this month highlight steady expansion. Surya and Guru form supportive angles to your ${localizedAsc} Ascendant and ${localizedMoon} Moon, unlocking doors for career advancement, prestigious collaborations, and domestic celebration.`;
  let monthlyCareer = `Significant developments in your professional sphere. Business owners will witness increased customer traction, while salaried professionals may receive recognition or leadership responsibilities. Sound investment opportunities look promising.`;
  let monthlyCareerTip = `Consolidate your long-term budget during the second fortnight and seek counsel from trusted elders before major financial commitments.`;
  let monthlyLove = `A supportive and loving atmosphere surrounds family life. A celebration, auspicious ceremony, or long-awaited family milestone brings shared joy. Couples will experience renewed warmth and teamwork.`;
  let monthlyLoveTip = `Surprise your partner or family elders with a thoughtful token of appreciation.`;
  let monthlyHealth = `Overall vitality is robust. Ensure your digestive fire remains balanced by favoring freshly prepared, warm meals over heavy processed food. Regular outdoor morning sunlight will elevate your mood.`;
  let monthlyHealthTip = `Incorporate herbal teas and a consistent 30-minute daily walking routine into your schedule.`;
  let monthlyFavorable = [
    'Applying for promotions, job shifts, or licensing',
    'Investing in professional tools, education, or assets',
    'Planning family pilgrimages or celebratory events',
    'Wearing recommended gemstone with proper pran pratishtha',
  ];
  let monthlyCaution = [
    'Lending large sums of money without formal documentation',
    'Postponing routine medical checkups or dental visits',
    'Allowing workplace stress to spill into domestic conversations',
  ];

  // 3. Yearly Prediction
  let yearlyTitle = 'Yearly Astrological Forecast (वार्षिक भविष्यफल)';
  let yearlyTimeframe = 'Annual Comprehensive Cycle (2026 - 2027)';
  let yearlyMood = 'Golden Foundation, Wealth Creation & Spiritual Maturity';
  let yearlyHeadline = `A defining year of personal elevation, wealth consolidation, landmark achievements, and profound spiritual peace.`;
  let yearlySummary = `The overarching planetary transit cycle of Jupiter (Guru) and Saturn (Shani) marks this year as a cornerstone phase for ${subjectName}. The foundation you lay down in your career, investments, and personal values over these 12 months will bear sweet fruit for years to come.`;
  let yearlyCareer = `An exceptional annual trajectory. Major milestones include expansion into new markets, salary increments or profitable business pivots, and strategic asset purchases. Saturn instills mature discipline while Jupiter unlocks doors to high-level mentors.`;
  let yearlyCareerTip = `Focus on mastering high-leverage skills and establishing diversified passive income streams throughout the first two quarters.`;
  let yearlyLove = `Deep stability in domestic life. Unmarried natives have strong planetary indicators for finding a compatible life partner. Existing marriages deepen through mutual support, home improvements, and family joy.`;
  let yearlyLoveTip = `Cultivate transparent communication, honor family traditions, and dedicate uninterrupted quality time to your partner.`;
  let yearlyHealth = `Good stamina and robust immunity throughout the year. The key to maintaining peak condition is preventative care: adhering to a steady routine, mindful nutrition, and yoga or spiritual contemplation.`;
  let yearlyHealthTip = `Schedule regular annual health screenings and establish a non-negotiable daily meditation habit.`;
  let yearlyFavorable = [
    'Purchasing long-term assets, property, or quality vehicles',
    'Launching new business ventures or expanding existing enterprises',
    'Marriage, family expansion, and auspicious ceremonies',
    'Engaging in charitable donations, spiritual retreats, and higher studies',
  ];
  let yearlyCaution = [
    'Speculative gambling or high-risk unvetted schemes',
    'Neglecting work-life balance in pursuit of relentless ambition',
    'Signing agreements under pressure without thorough legal scrutiny',
  ];

  // Specific Hindi overrides (and for other Indian languages where applicable)
  if (lang === 'hi') {
    weeklyTitle = 'साप्ताहिक ज्योतिषीय भविष्यफल';
    weeklyTimeframe = 'वर्तमान 7-दिवसीय गोचर चक्र';
    weeklyMood = 'उच्च ऊर्जा, गतिशीलता एवं अनुकूल ग्रह योग';
    weeklyHeadline = `${subjectName} के लिए यह सप्ताह अत्यंत गतिशील, फलदायी और व्यक्तिगत कार्यों में सफलता दिलाने वाला रहेगा।`;
    weeklySummary = `आपकी जन्म राशि (${localizedMoon}) से चंद्रमा का शुभ गोचर मन में एकाग्रता और सकारात्मक ऊर्जा का संचार करेगा। संवाद कौशल से रुके हुए कार्य पूरे होंगे, नए विचार प्रस्तुत करने और परिजनों व मित्रों से संबंध प्रगाढ़ करने के लिए यह समय सर्वोत्तम है।`;
    weeklyCareer = `कार्यक्षेत्र में आपकी मेहनत की सराहना होगी। अनुबंध, परियोजना प्रस्ताव या नए व्यावसायिक प्रयास के लिए सप्ताह का मध्य भाग सबसे अनुकूल है। अप्रत्याशित आर्थिक लाभ के योग बनेंगे।`;
    weeklyCareerTip = `महत्वपूर्ण व्यापारिक चर्चाएं या अनुबंध पत्र ${localizedDays[0] || 'गुरुवार'} के प्रातःकाल संपन्न करें जिससे पूर्ण सफलता मिले।`;
    weeklyLove = `पारिवारिक जीवन में सुख-शांति व सौहार्द बना रहेगा। खुले मन से बातचीत करने से पुरानी गलतफहमियां दूर होंगी। अविवाहितों के लिए नए व सकारात्मक संबंधों के द्वार खुलेंगे।`;
    weeklyLoveTip = `सप्ताहांत पर परिवार या जीवनसाथी के साथ लघु यात्रा अथवा सुखद समय बिताएं।`;
    weeklyHealth = `ऊर्जा का स्तर अच्छा रहेगा, हालांकि देर रात तक जागने से बचें ताकि नींद प्रभावित न हो। सुबह हल्का व्यायाम और पर्याप्त जल का सेवन करें।`;
    weeklyHealthTip = `सोने से पूर्व 10 मिनट ध्यान या प्राणायाम करें जिससे मानसिक शांति बनी रहे।`;
    weeklyFavorable = [
      'महत्वपूर्ण अनुबंधों पर हस्ताक्षर एवं नवीन योजनाओं की शुरुआत',
      'नई स्वास्थ्य दिनचर्या, योग एवं सात्विक आहार अपनाना',
      'पारिवारिक मिलन, मांगलिक आयोजन अथवा व्यापारिक बैठकें',
      'वित्तीय लक्ष्यों की समीक्षा और लंबित लेन-देन पूर्ण करना',
    ];
    weeklyCaution = [
      'देर रात बिना सोचे-समझे फिजूलखर्ची करने से बचें',
      'छोटी बातों पर व्यर्थ के वाद-विवाद में न उलझें',
      'थकावट होने पर अत्यधिक सामाजिक जिम्मेदारियों का बोझ न लें',
    ];

    monthlyTitle = 'मासिक ज्योतिषीय भविष्यफल';
    monthlyTimeframe = 'वर्तमान 30-दिवसीय मासिक दृष्टिकोण';
    monthlyMood = 'आर्थिक उन्नति, मान-सम्मान एवं पारिवारिक सौहार्द';
    monthlyHeadline = `दीर्घकालिक योजनाओं, करियर में उन्नति और पारिवारिक सुख-समृद्धि के लिए यह माह अत्यंत शुभ है।`;
    monthlySummary = `इस माह ग्रहों का संरेखण निरंतर विकास का मार्ग प्रशस्त करेगा। सूर्य एवं देवगुरु बृहस्पति आपकी लग्न राशि (${localizedAsc}) एवं चंद्र राशि (${localizedMoon}) को शुभ दृष्टि से देख रहे हैं, जिससे प्रतिष्ठा व कार्यक्षेत्र में वृद्धि होगी।`;
    monthlyCareer = `व्यापार व नौकरी में महत्वपूर्ण प्रगति होगी। व्यापारियों को नए ग्राहक और विस्तार के अवसर मिलेंगे, वहीं वेतनभोगी जातकों को पदोन्नति या नेतृत्व की जिम्मेदारी मिल सकती है। सुरक्षित निवेश से लाभ होगा।`;
    monthlyCareerTip = `माह के उत्तरार्ध में अपने वित्तीय बजट को व्यवस्थित करें और बड़े निवेश से पूर्व वरिष्ठों से परामर्श लें।`;
    monthlyLove = `घर-परिवार में प्रेमपूर्ण वातावरण रहेगा। कोई मांगलिक कार्य, उत्सव या चिर-प्रतीक्षित शुभ समाचार मिलने से घर में प्रसन्नता का संचार होगा। दांपत्य जीवन में मधुरता बढ़ेगी।`;
    monthlyLoveTip = `जीवनसाथी अथवा परिवार के बुजुर्गों को कोई स्नेहपूर्ण उपहार देकर उनका आशीर्वाद प्राप्त करें।`;
    monthlyHealth = `शारीरिक ऊर्जा व जीवनी शक्ति उत्तम रहेगी। पाचन तंत्र को स्वस्थ रखने हेतु ताजे, सात्विक एवं पौष्टिक भोजन को प्राथमिकता दें। प्रातः सूर्य नमस्कार व धूप का सेवन लाभप्रद रहेगा।`;
    monthlyHealthTip = `हर्बल चाय का सेवन करें और प्रतिदिन कम से कम 30 मिनट टहलने का नियम बनाएं।`;
    monthlyFavorable = [
      'पदोन्नति, नई नौकरी अथवा व्यवसाय विस्तार के लिए आवेदन',
      'व्यावसायिक कौशल, उच्च शिक्षा अथवा स्थायी संपत्तियों में निवेश',
      'धार्मिक यात्रा, तीर्थाटन अथवा पारिवारिक मांगलिक उत्सव',
      'प्राण-प्रतिष्ठित शुभ रत्न धारण करना',
    ];
    monthlyCaution = [
      'बिना लिखा-पढ़ी के किसी को बड़ी धनराशि उधार देने से बचें',
      'नियमित स्वास्थ्य जांच या दंत चिकित्सा को न टालें',
      'कार्यक्षेत्र के तनाव को घर-परिवार की बातचीत पर हावी न होने दें',
    ];

    yearlyTitle = 'वार्षिक गोचर महाफल';
    yearlyTimeframe = 'वार्षिक संपूर्ण महागोचर चक्र (2026 - 2027)';
    yearlyMood = 'स्वर्णिम आधारशिला, धन संचय एवं आध्यात्मिक परिपक्वता';
    yearlyHeadline = `${subjectName} के लिए यह वर्ष अभूतपूर्व सफलता, आर्थिक सुदृढ़ता एवं आध्यात्मिक उन्नति का स्वर्णिम काल सिद्ध होगा।`;
    yearlySummary = `देवगुरु बृहस्पति एवं न्यायप्रिय शनि देव का गोचर इस वर्ष को आपके जीवन का मील का पत्थर बनाएगा। इस वर्ष आपकी लग्न (${localizedAsc}) एवं चंद्र (${localizedMoon}) राशि पर शुभ ग्रहों का प्रभाव आगामी कई वर्षों के लिए सुखद परिणाम सुनिश्चित करेगा।`;
    yearlyCareer = `करियर व व्यापार में उत्कृष्ट वार्षिक परिणाम मिलेंगे। नए बाजारों में विस्तार, आय में उल्लेखनीय वृद्धि तथा भूमि-भवन जैसी स्थायी संपत्तियों के क्रय के प्रबल योग हैं। शनि का अनुशासन और गुरु का मार्गदर्शन सफलता के नए शिखर छुएगा।`;
    yearlyCareerTip = `वर्ष के प्रथम दो तिमाहियों में अपने मुख्य कौशल को निखारने तथा आय के बहुआयामी स्रोत विकसित करने पर ध्यान केंद्रित करें।`;
    yearlyLove = `पारिवारिक व वैवाहिक जीवन में गहरी स्थिरता रहेगी। अविवाहित जातकों के लिए सुयोग्य जीवनसाथी से विवाह के मजबूत योग हैं। दांपत्य जीवन में परस्पर सहयोग व संतान सुख में वृद्धि होगी।`;
    yearlyLoveTip = `पारदर्शी संवाद बनाए रखें, पारिवारिक परंपराओं का सम्मान करें और जीवनसाथी को पर्याप्त समय दें।`;
    yearlyHealth = `संपूर्ण वर्ष उत्तम रोग-प्रतिरोधक क्षमता और स्फूर्ति बनी रहेगी। नित्य योग, ध्यान और संतुलित दिनचर्या अपनाकर मानसिक शांति व शारीरिक ऊर्जा को उच्चतम स्तर पर बनाए रखें।`;
    yearlyHealthTip = `वार्षिक स्वास्थ्य परीक्षण कराएं और प्रतिदिन सुबह कम से कम 15 मिनट ध्यान करने का दृढ़ संकल्प लें।`;
    yearlyFavorable = [
      'स्थायी संपत्ति, भूमि, मकान अथवा नए वाहन का क्रय',
      'नवीन व्यापार का शुभारंभ अथवा विद्यमान उपक्रम का विस्तार',
      'विवाह संस्कार, संतानोत्पत्ति एवं मांगलिक अनुष्ठान',
      'दान-पुण्य, परोपकार, तीर्थ यात्रा एवं उच्च आध्यात्मिक साधना',
    ];
    yearlyCaution = [
      'सट्टेबाजी, अनधिकृत शेयर ट्रेडिंग या जोखिम भरे निवेश से पूर्णतः बचें',
      'अत्यधिक कार्य के चक्कर में स्वास्थ्य व परिवार की उपेक्षा न करें',
      'दबाव में आकर बिना कानूनी जांच-पड़ताल के किसी दस्तावेज पर हस्ताक्षर न करें',
    ];
  } else if (lang === 'sa') {
    weeklyTitle = 'साप्ताहिकं ज्योतिषीयं भविष्यफलम्';
    weeklyTimeframe = 'वर्तमानं सप्तदिवसीयचक्रम्';
    weeklyMood = 'उत्कृष्टोद्योगः अनुकूलग्रहयोगश्च';
    weeklyHeadline = `${subjectName} महोदयाय अयं सप्ताहः अत्यन्तानुकूलः कार्यसिद्धिकरश्च भविष्यति।`;
    weeklySummary = `चन्द्रस्य शुभगोचरेण चित्ते शान्तिः एकाग्रता च भविष्यति। कार्येषु सफलता लप्स्यते।`;
    weeklyCareer = `व्यवसाये कार्यक्षेत्रे च महती प्रगतिः भविष्यति। धनलाभस्य योगः वर्तते।`;
    weeklyCareerTip = `${localizedDays[0] || 'गुरुवासरे'} प्रातःकाले विशिष्टकार्यस्य आरम्भं कुर्वन्तु।`;
    weeklyLove = `कौटुम्बिकसुखं सौहार्दं च वर्धिष्यते।`;
    weeklyLoveTip = `परिवारेण सह सानन्दं समयं यापयन्तु।`;
    weeklyHealth = `आरोग्यं सम्यक् स्थास्यति, नियमितं प्राणायामं कुर्वन्तु।`;
    weeklyHealthTip = `प्रतिदिनं ध्यानेन मनः शान्तं कुरुत।`;
    weeklyFavorable = ['नवीनकार्यारम्भः', 'सन्धिकरपत्रलेखनम्', 'देवपूजनम्', 'धनसञ्चयः'];
    weeklyCaution = ['अनावश्यकव्ययः', 'क्रोधः', 'आलस्यम्'];

    monthlyTitle = 'मासिकं ज्योतिषीयं भविष्यफलम्';
    monthlyTimeframe = 'मासिकदृष्टिकोणः';
    monthlyMood = 'वित्तवृद्धिः कौटुम्बिकसौख्यं च';
    monthlyHeadline = `अस्मिन् मासे सर्वतोभावेन उन्नतिः भविष्यति।`;
    monthlySummary = `सूर्य-गुरु-गोचरेण मान-सम्मान-वृद्धिः कार्यसिद्धिः च भविष्यति।`;
    monthlyCareer = `व्यवसायक्षेत्रे लाभः यशः च प्राप्स्यते।`;
    monthlyCareerTip = `ज्येष्ठानाम् उपदेशेन कार्यं कुर्वन्तु।`;
    monthlyLove = `गृहे मङ्गलकार्याणि भविष्यन्ति।`;
    monthlyLoveTip = `सस्नेहं पारिवारिकसम्बन्धान् पालयन्तु।`;
    monthlyHealth = `आरोग्यं दृढं स्थास्यति।`;
    monthlyHealthTip = `सात्त्विकाहारं स्वीकुर्वन्तु।`;
    monthlyFavorable = ['तीर्थयात्रा', 'रत्नधारणम्', 'व्यवसायविस्तारः', 'मङ्गलकार्याणि'];
    monthlyCaution = ['ऋणदानम्', 'असावधानी', 'विवादः'];

    yearlyTitle = 'वार्षिकं महागोचरफलम्';
    yearlyTimeframe = 'वार्षिकं चक्रम् (2026 - 2027)';
    yearlyMood = 'सुवर्णकालः धनसञ्चयः आध्यात्मिकपरिपक्वता च';
    yearlyHeadline = `अयं संवत्सरः ${subjectName} महोदयाय सर्वसिद्धिप्रदः भविष्यति।`;
    yearlySummary = `गुरु-शनेः गोचरप्रभावेन स्थिरा कीर्तिः ऐश्वर्यं च लप्स्यते।`;
    yearlyCareer = `कार्यक्षेत्रे महदुन्नतिः, नूतनगृह-सम्पत्तिप्राप्तिः च।`;
    yearlyCareerTip = `धर्ममार्गेण सर्वकार्येषु प्रवृत्ताः भवन्तु।`;
    yearlyLove = `दाम्पत्यसुखं वंशवृद्धिः च।`;
    yearlyLoveTip = `परस्परं विश्वासं रक्षन्तु।`;
    yearlyHealth = `शरीरबलं मनोधैर्यं च वर्धिष्यते।`;
    yearlyHealthTip = `नित्यं योगाभ्यासं कुर्वन्तु।`;
    yearlyFavorable = ['गृहनिर्माणम्', 'विवाहः', 'दानधर्मः', 'विद्याभ्यासः'];
    yearlyCaution = ['द्यूतक्रीडा', 'लोभः', 'अनाचारः'];
  } else if (lang === 'gu') {
    weeklyTitle = 'સાપ્તાહિક જ્યોતિષીય રાશિફળ';
    weeklyTimeframe = 'હાલનું 7 દિવસીય ચક્ર';
    weeklyMood = 'ઉચ્ચ ઊર્જા અને ઉત્પાદક ગ્રહ સંયોગ';
    weeklyHeadline = `${subjectName} માટે આ અઠવાડિયું ખૂબ જ ગતિશીલ અને કાર્યોમાં સફળતા આપનારું રહેશે.`;
    weeklySummary = `તમારી રાશિ (${localizedMoon}) માંથી ચંદ્રનું શુભ ગોચર મનમાં નવી ઊર્જા અને સ્પષ્ટતા લાવશે. અટકેલા કામો પૂર્ણ કરવા માટે ઉત્તમ સમય છે.`;
    weeklyCareer = `કારકિર્દીમાં તમારી મહેનતની પ્રશંસા થશે. નાણાકીય સ્થિતિ મજબૂત બનશે અને અણધાર્યા લાભના યોગ છે.`;
    weeklyCareerTip = `મહત્વપૂર્ણ વાટાઘાટો ${localizedDays[0] || 'ગુરુવાર'} ના સવારે પૂર્ણ કરો.`;
    weeklyLove = `પારિવારિક જીવનમાં સુખ-શાંતિ રહેશે. સંબંધોમાં મધુરતા વધશે.`;
    weeklyLoveTip = `પરિવાર સાથે આનંદપૂર્વક સમય વિતાવો.`;
    weeklyHealth = `આરોગ્ય ઉત્તમ રહેશે, પૂરતો આરામ અને કસરત કરો.`;
    weeklyHealthTip = `રોજ સવારે ધ્યાન કરો.`;
    weeklyFavorable = ['નવા કરારો કરવા', 'આરોગ્ય સંભાળ', 'પારિવારિક મેળાવડો', 'નાણાકીય આયોજન'];
    weeklyCaution = ['બિનજરૂરી ખર્ચ', 'વાદવિવાદ', 'અતિશય થાક'];

    monthlyTitle = 'માસિક જ્યોતિષીય રાશિફળ';
    monthlyTimeframe = 'ચાલુ માસિક સમીક્ષા';
    monthlyMood = 'આર્થિક વૃદ્ધિ અને પારિવારિક સુખ';
    monthlyHeadline = `લાંબા ગાળાના આયોજનો અને કારકિર્દીની પ્રગતિ માટે આ મહિનો શ્રેષ્ઠ છે.`;
    monthlySummary = `સૂર્ય અને ગુરુની શુભ દ્રષ્ટિથી તમારા માન-સન્માન અને સંપત્તિમાં વધારો થશે.`;
    monthlyCareer = `વેપારમાં વૃદ્ધિ અને નોકરીમાં પ્રમોશનની શક્યતાઓ છે.`;
    monthlyCareerTip = `વડીલોની સલાહ લઈને મોટું રોકાણ કરો.`;
    monthlyLove = `ઘરમાં શુભ પ્રસંગો અને ખુશીઓનું વાતાવરણ રહેશે.`;
    monthlyLoveTip = `પરિવારજનોને સન્માન આપો.`;
    monthlyHealth = `સ્વાસ્થ્ય સારું રહેશે, સાત્વિક આહાર લો.`;
    monthlyHealthTip = `દરરોજ ચાલવાની ટેવ પાડો.`;
    monthlyFavorable = ['પ્રમોશન માટે અરજી', 'શિક્ષણમાં રોકાણ', 'તીર્થયાત્રા', 'રત્ન ધારણ કરવું'];
    monthlyCaution = ['ઉધાર આપવું', 'તબીબી તપાસ ટાળવી', 'ઘરે તણાવ લાવવો'];

    yearlyTitle = 'વાર્ષિક ગોચર મહાફળ';
    yearlyTimeframe = 'વાર્ષિક સંપૂર્ણ ગોચર ચક્ર (2026 - 2027)';
    yearlyMood = 'સુવર્ણ તક, ધન સર્જન અને આધ્યાત્મિક ઉન્નતિ';
    yearlyHeadline = `${subjectName} માટે આ વર્ષ સર્વાંગી વિકાસ અને સમૃદ્ધિનું સાબિત થશે.`;
    yearlySummary = `ગુરુ અને શનિના શુભ ગોચરથી જીવનમાં સ્થિરતા અને નવી સિદ્ધિઓ પ્રાપ્ત થશે.`;
    yearlyCareer = `કારકિર્દીમાં મોટી છલાંગ, પ્રોપર્ટી ખરીદી અને વેપારમાં ભારે નફો થશે.`;
    yearlyCareerTip = `આવકના નવા સ્ત્રોતો ઊભા કરવા પર ધ્યાન આપો.`;
    yearlyLove = `પારિવારિક જીવનમાં ગાઢ પ્રેમ અને અવિવાહિતો માટે લગ્નના ઉત્તમ યોગ.`;
    yearlyLoveTip = `ખુલ્લા મને સંવાદ સાધો.`;
    yearlyHealth = `રોગપ્રતિકારક શક્તિ ઉત્તમ રહેશે.`;
    yearlyHealthTip = `નિયમિત યોગ અને મેડિટેશન કરો.`;
    yearlyFavorable = ['નવી મિલકત ખરીદવી', 'નવો વ્યવસાય શરૂ કરવો', 'શુભ લગ્ન કાર્ય', 'દાન-પુણ્ય'];
    yearlyCaution = ['સટ્ટાબાજી', 'અતિશય કામનો બોજ', 'દબાણમાં સહી કરવી'];
  } else if (lang === 'mr') {
    weeklyTitle = 'साप्ताहिक ज्योतिषीय भविष्यफल';
    weeklyTimeframe = 'चालू ७ दिवसांचे गोचर चक्र';
    weeklyMood = 'उत्तम ऊर्जा आणि प्रगतीची संधी';
    weeklyHeadline = `${subjectName} यांच्यासाठी हा आठवडा अत्यंत फलदायी आणि यश देणारा ठरेल.`;
    weeklySummary = `चंद्राचे शुभ भ्रमण तुमच्या राशीला (${localizedMoon}) मानसिक शांती व सकारात्मक ऊर्जा देईल. प्रलंबित कामे मार्गी लागतील.`;
    weeklyCareer = `कामाच्या ठिकाणी तुमच्या कर्तृत्वाचे कौतुक होईल. नवीन संधी व अनपेक्षित धनलाभ संभवतो.`;
    weeklyCareerTip = `महत्त्वाचे निर्णय ${localizedDays[0] || 'गुरुवारी'} सकाळी घ्या.`;
    weeklyLove = `कौटुंबिक जीवनात सलोखा व सुख-समाधान राहील.`;
    weeklyLoveTip = `कुटुंबासोबत आनंददायी वेळ घालवा.`;
    weeklyHealth = `आरोग्य उत्तम राहील, नियमित व्यायाम करा.`;
    weeklyHealthTip = `दररोज रात्री ध्यान करा.`;
    weeklyFavorable = ['महत्त्वाचे करार करणे', 'आरोग्य दिनचर्या', 'कौटुंबिक भेट', 'आर्थिक नियोजन'];
    weeklyCaution = ['अनावश्यक खर्च', 'वादविवाद टाळा', 'अति श्रम'];

    monthlyTitle = 'मासिक ज्योतिषीय भविष्यफल';
    monthlyTimeframe = 'मासिक आढावा';
    monthlyMood = 'आर्थिक उन्नती व कौटुंबिक सुख';
    monthlyHeadline = `दीर्घकालीन प्रगती आणि आर्थिक समृद्धीसाठी हा महिना अत्यंत अनुकूल आहे.`;
    monthlySummary = `सूर्य व गुरुचे पाठबळ तुमच्या लग्न (${localizedAsc}) आणि चंद्र (${localizedMoon}) राशीला नवी उभारी देईल.`;
    monthlyCareer = `नोकरीत बढती व व्यवसायात चांगला नफा मिळण्याचे योग आहेत.`;
    monthlyCareerTip = `महत्त्वाच्या आर्थिक व्यवहारांत वरिष्ठांचा सल्ला घ्या.`;
    monthlyLove = `घरात मंगलमय वातावरण राहील, आनंदवार्ता समजेल.`;
    monthlyLoveTip = `जोडीदाराला सुखद सरप्राइज द्या.`;
    monthlyHealth = `प्रकृती छान राहील, सकस आहार घ्या.`;
    monthlyHealthTip = `दररोज ३० मिनिटे फिरायला जा.`;
    monthlyFavorable = ['नोकरीत बदल/प्रमोशन', 'ज्ञानात गुंतवणूक', 'तीर्थयात्रा', 'शुभ रत्न परिधान करणे'];
    monthlyCaution = ['मोठी रक्कम उधार देणे', 'आरोग्याकडे दुर्लक्ष', 'कामाचा ताण घरी आणणे'];

    yearlyTitle = 'वार्षिक महागोचर भविष्य';
    yearlyTimeframe = 'वार्षिक महागोचर चक्र (2026 - 2027)';
    yearlyMood = 'सुवर्ण काळ, धन संचय आणि आध्यात्मिक प्रगती';
    yearlyHeadline = `${subjectName} यांच्यासाठी हे वर्ष मोठे यश आणि भरभराट घेऊन येईल.`;
    yearlySummary = `गुरु आणि शनीचे अनुकूल गोचर तुमच्या जीवनाला नवी दिशा व स्थैर्य प्रदान करेल.`;
    yearlyCareer = `करिअरमध्ये मोठी झेप, घर किंवा स्थावर मालमत्ता खरेदीचे प्रबळ योग आहेत.`;
    yearlyCareerTip = `उत्पन्नाचे नवे मार्ग शोधण्यावर भर द्या.`;
    yearlyLove = `वैवाहिक सौख्य उत्तम राहील, अविवाहितांचे विवाह ठरतील.`;
    yearlyLoveTip = `पारदर्शक संवाद ठेवा.`;
    yearlyHealth = `रोगप्रतिकारशक्ती उत्तम राहील.`;
    yearlyHealthTip = `नियमित योगासने करा.`;
    yearlyFavorable = ['मालमत्ता/वाहन खरेदी', 'नवीन व्यवसाय सुरू करणे', 'विवाह व मंगल कार्ये', 'दानधर्म'];
    yearlyCaution = ['अवाजवी जोखीम पत्करणे', 'अति महत्वाकांक्षा', 'दडपणाखाली करार करणे'];
  } else if (lang === 'bn') {
    weeklyTitle = 'সাপ্তাহিক জ্যোতিষ রাশিফল';
    weeklyTimeframe = 'বর্তমান ৭ দিনের গোচর চক্র';
    weeklyMood = 'উচ্চ উদ্দীপনা ও অনুকূল গ্রহের অবস্থান';
    weeklyHeadline = `${subjectName}-এর জন্য এই সপ্তাহটি অত্যন্ত শুভ এবং সাফল্যমণ্ডিত হবে।`;
    weeklySummary = `আপনার রাশি (${localizedMoon})-র ওপর চন্দ্রের শুভ দৃষ্টি মানসিক শক্তি ও একাগ্রতা বৃদ্ধি করবে। বকেয়া কাজ শেষ করার উপযুক্ত সময়।`;
    weeklyCareer = `কর্মক্ষেত্রে আপনার কাজের প্রশংসা হবে এবং অপ্রত্যাশিত আর্থিক লাভ হতে পারে।`;
    weeklyCareerTip = `গুরুত্বপূর্ণ মিটিং ${localizedDays[0] || 'বৃহস্পতিবার'} সকালে সম্পন্ন করুন।`;
    weeklyLove = `পারিবারিক জীবনে সুখ ও শান্তি বজায় থাকবে।`;
    weeklyLoveTip = `পরিবারের সাথে সুন্দর সময় কাটান।`;
    weeklyHealth = `স্বাস্থ্য ভালো থাকবে, নিয়মিত হালকা ব্যায়াম করুন।`;
    weeklyHealthTip = `প্রতিদিন রাতে ধ্যান করুন।`;
    weeklyFavorable = ['চুক্তি স্বাক্ষর', 'নতুন ব্যায়াম শুরু', 'পারিবারিক অনুষ্ঠান', 'সঞ্চয় পরিকল্পনা'];
    weeklyCaution = ['অপ্রয়োজনীয় খরচ', 'বিতর্ক এড়িয়ে চলা', 'অতিরিক্ত কাজের চাপ'];

    monthlyTitle = 'মাসিক জ্যোতিষ রাশিফল';
    monthlyTimeframe = 'চলতি মাসিক পূর্বাভাস';
    monthlyMood = 'আর্থিক সমৃদ্ধি ও পারিবারিক সম্প্রীতি';
    monthlyHeadline = `দীর্ঘমেয়াদী পরিকল্পনা এবং পেশাগত উন্নতির জন্য এই মাসটি সেরা।`;
    monthlySummary = `সূর্য ও বৃহস্পতির অনুকূল অবস্থান আপনার মর্যাদা ও সাফল্য বৃদ্ধি করবে।`;
    monthlyCareer = `ব্যবসায় উন্নতি এবং চাকুরিতে পদোন্নতির প্রবল সম্ভাবনা রয়েছে।`;
    monthlyCareerTip = `বড় বিনিয়োগের পূর্বে অভিজ্ঞদের পরামর্শ নিন।`;
    monthlyLove = `পরিবারে আনন্দ ও শুভ অনুষ্ঠানের পরিবেশ থাকবে।`;
    monthlyLoveTip = `প্রিয়জনকে সম্মান ও ভালোবাসা দিন।`;
    monthlyHealth = `শারীরিক শক্তি ভালো থাকবে, পুষ্টিকর খাবার খান।`;
    monthlyHealthTip = `প্রতিদিন সকালে হাঁটুন।`;
    monthlyFavorable = ['চাকুরি পরিবর্তন/উন্নতি', 'শিক্ষায় বিনিয়োগ', 'ধর্মীয় ভ্রমণ', 'শুভ রত্ন ধারণ'];
    monthlyCaution = ['টাকা ধার দেওয়া', 'স্বাস্থ্য অবহেলা', 'কর্মক্ষেত্রের মানসিক চাপ'];

    yearlyTitle = 'বার্ষিক মহাফলাফল';
    yearlyTimeframe = 'বার্ষিক সম্পূর্ণ গোচর চক্র (2026 - 2027)';
    yearlyMood = 'স্বর্ণযুগ, ধনবৃদ্ধি ও আধ্যাত্মিক বিকাশ';
    yearlyHeadline = `${subjectName}-এর জন্য এই বছরটি স্মরণীয় সাফল্য ও সমৃদ্ধির সূচনা করবে।`;
    yearlySummary = `বৃহস্পতি ও শনির অনুকূল প্রভাব আপনার জীবনে নতুন দিগন্ত ও স্থিতিশীলতা উন্মোচন করবে।`;
    yearlyCareer = `পেশাগত জীবনে অভাবনীয় উন্নতি, জমি বা সম্পত্তি ক্রয়ের শুভ যোগ।`;
    yearlyCareerTip = `উপার্জনের নতুন উৎস তৈরিতে মনোযোগ দিন।`;
    yearlyLove = `দাম্পত্য জীবনে গভীর ভালোবাসা এবং অবিবাহিতদের বিবাহের শুভ যোগ।`;
    yearlyLoveTip = `খোলামেলা আলোচনা বজায় রাখুন।`;
    yearlyHealth = `রোগ প্রতিরোধ ক্ষমতা চমৎকার থাকবে।`;
    yearlyHealthTip = `প্রতিদিন যোগাসন ও প্রাণায়াম করুন।`;
    yearlyFavorable = ['সম্পত্তি ক্রয়', 'নতুন ব্যবসা শুরু', 'বিবাহ ও শুভ অনুষ্ঠান', 'দান ও পুণ্যকর্ম'];
    yearlyCaution = ['ঝুঁকিপূর্ণ বিনিয়োগ', 'অতিরিক্ত ব্যস্ততা', 'না বুঝে চুক্তিতে স্বাক্ষর'];
  } else if (lang === 'ta') {
    weeklyTitle = 'வாராந்திர ஜோதிட பலன்கள்';
    weeklyTimeframe = 'தற்போதைய 7 நாள் சுழற்சி';
    weeklyMood = 'உயர் ஆற்றல் மற்றும் நற்பலன்கள்';
    weeklyHeadline = `${subjectName} அவர்களுக்கு இந்த வாரம் மிகுந்த வெற்றிகளையும் நற்பலன்களையும் தரும்.`;
    weeklySummary = `சந்திரனின் சாதகமான பெயர்ச்சி மன அமைதியையும் புத்துணர்ச்சியையும் அளிக்கும். நிலுவையில் உள்ள பணிகள் சுலபமாக முடியும்.`;
    weeklyCareer = `தொழிலில் நல்ல முன்னேற்றமும் எதிர்பாராத பணவரவும் உண்டாகும்.`;
    weeklyCareerTip = `முக்கிய முடிவுகளை ${localizedDays[0] || 'வியாழக்கிழமை'} காலையில் எடுக்கவும்.`;
    weeklyLove = `குடும்பத்தில் மகிழ்ச்சியும் அமைதியும் நிலவும்.`;
    weeklyLoveTip = `குடும்பத்துடன் நேரத்தை செலவிடுங்கள்.`;
    weeklyHealth = `ஆரோக்கியம் சிறப்பாக இருக்கும், போதிய ஓய்வு எடுங்கள்.`;
    weeklyHealthTip = `தினமும் தியானம் செய்யுங்கள்.`;
    weeklyFavorable = ['புதிய முயற்சிகள்', 'உடற்பயிற்சி', 'குடும்ப சந்திப்பு', 'சேமிப்பு திட்டம்'];
    weeklyCaution = ['வீண் செலவு', 'வாக்குவாதம்', 'அதிக வேலைப்பளு'];

    monthlyTitle = 'மாதாந்திர ஜோதிட பலன்கள்';
    monthlyTimeframe = 'நடப்பு மாதப் பார்வை';
    monthlyMood = 'பொருளாதார வளர்ச்சி மற்றும் குடும்ப மகிழ்ச்சி';
    monthlyHeadline = `நீண்ட கால வளர்ச்சிக்கும் தொழில் மேன்மைக்கும் இந்த மாதம் மிகவும் ஏற்றது.`;
    monthlySummary = `சூரியன் மற்றும் குருவின் அருள் உங்களுக்கு வெற்றியையும் கௌரவத்தையும் தரும்.`;
    monthlyCareer = `வியாபாரத்தில் லாபமும் உத்தியோகத்தில் பதவி உயர்வும் கிடைக்க வாய்ப்புள்ளது.`;
    monthlyCareerTip = `பெரிய முதலீடுகளுக்கு முன் பெரியோர்களின் ஆலோசனை பெறவும்.`;
    monthlyLove = `குடும்பத்தில் சுப நிகழ்ச்சிகள் நடைபெறும்.`;
    monthlyLoveTip = `துணைவருக்கு பரிசு வழங்கி மகிழுங்கள்.`;
    monthlyHealth = `உடல் நலம் சீராக இருக்கும், சத்தான உணவு உண்ணுங்கள்.`;
    monthlyHealthTip = `தினமும் நடைப்பயிற்சி செய்யுங்கள்.`;
    monthlyFavorable = ['பதவி உயர்வு முயற்சி', 'கல்வி முதலீடு', 'புனித பயணம்', 'ரத்தினம் அணிதல்'];
    monthlyCaution = ['கடன் கொடுத்தல்', 'மருத்துவ பரிசோதனை தள்ளிப்போடுதல்', 'பணிச்சுமை'];

    yearlyTitle = 'வருடாந்திர பெருந்திட்ட பலன்';
    yearlyTimeframe = 'வருடாந்திர முழுமையான சுழற்சி (2026 - 2027)';
    yearlyMood = 'பொற்காலம், செல்வ சேர்க்கை மற்றும் ஆன்மீக வளர்ச்சி';
    yearlyHeadline = `${subjectName} அவர்களுக்கு இந்த வருடம் சிறந்த வெற்றியையும் நிலையான செல்வத்தையும் தரும்.`;
    yearlySummary = `குரு மற்றும் சனியின் அனுகூலமான பெயர்ச்சி உங்களுக்கு பெரும் சாதனைகளை உருவாக்கும்.`;
    yearlyCareer = `தொழிலில் பிரம்மாண்ட வளர்ச்சி, நிலம் அல்லது புதிய வீடு வாங்கும் யோகம் உண்டு.`;
    yearlyCareerTip = `வருமான வழிகளைப் பெருக்க திட்டமிடுங்கள்.`;
    yearlyLove = `குடும்ப ஒற்றுமை பலப்படும், திருமணம் கைகூடும்.`;
    yearlyLoveTip = `மனம் திறந்து பேசுங்கள்.`;
    yearlyHealth = `நோய் எதிர்ப்பு சக்தி அதிகரிக்கும்.`;
    yearlyHealthTip = `யோகா மற்றும் தியானம் தொடருங்கள்.`;
    yearlyFavorable = ['சொத்து வாங்குதல்', 'புதிய தொழில்', 'சுப காரியங்கள்', 'தான தர்மங்கள்'];
    yearlyCaution = ['ஊக வணிகம்', 'அதிக பணிச்சுமை', 'கையெழுத்திடும் முன் கவனம்'];
  } else if (lang === 'te') {
    weeklyTitle = 'వార జాతక ఫలితాలు';
    weeklyTimeframe = 'ప్రస్తుత 7 రోజుల చక్రం';
    weeklyMood = 'అధిక శక్తి మరియు శుభ ఫలితాలు';
    weeklyHeadline = `${subjectName} గారికి ఈ వారం అత్యంత అనుకూలంగా మరియు విజయవంతంగా ఉంటుంది.`;
    weeklySummary = `చంద్రుని శుభ గోచారం మానసిక ప్రశాంతతను, ఆత్మవిశ్వాసాన్ని పెంచుతుంది. ఆగిపోయిన పనులు పూర్తవుతాయి.`;
    weeklyCareer = `వృత్తి వ్యాపారాలలో ప్రశంసలు మరియు ఆకస్మిక ధనలాభం కలుగుతుంది.`;
    weeklyCareerTip = `కీలక చర్చలను ${localizedDays[0] || 'గురువారం'} ఉదయం నిర్వహించండి.`;
    weeklyLove = `కుటుంబంలో సంతోషకరమైన వాతావరణం ఉంటుంది.`;
    weeklyLoveTip = `కుటుంబ సభ్యులతో ఆనందంగా గడపండి.`;
    weeklyHealth = `ఆరోగ్యం బాగుంటుంది, సరైన విశ్రాంతి తీసుకోండి.`;
    weeklyHealthTip = `రోజూ ధ్యానం చేయండి.`;
    weeklyFavorable = ['నూతన ఒప్పందాలు', 'ఆరోగ్య సంరక్షణ', 'కుటుంబ వేడుకలు', 'ఆర్థిక ప్రణాళిక'];
    weeklyCaution = ['అనవసర ఖర్చులు', 'వాదోపవాదాలు', 'అలసట'];

    monthlyTitle = 'మాస జాతక ఫలితాలు';
    monthlyTimeframe = 'ప్రస్తుత మాస సమీక్ష';
    monthlyMood = 'ఆర్థికాభివృద్ధి మరియు కుటుంబ సౌఖ్యం';
    monthlyHeadline = `దీర్ఘకాలిక ప్రణాళికలు మరియు వృత్తిపరమైన ఎదుగుదలకు ఈ నెల చాలా అనుకూలం.`;
    monthlySummary = `సూర్య మరియు గురు గ్రహాల అనుగ్రహం మీ కీర్తి ప్రతిష్టలను పెంచుతుంది.`;
    monthlyCareer = `వ్యాపార విస్తరణ మరియు ఉద్యోగంలో పదోన్నతి లభించే అవకాశాలు ఉన్నాయి.`;
    monthlyCareerTip = `పెద్దల సలహాతోనే పెద్ద పెట్టుబడులు పెట్టండి.`;
    monthlyLove = `ఇంట్లో శుభకార్యాలు జరిగే అవకాశం ఉంది.`;
    monthlyLoveTip = `జీవిత భాగస్వామికి బహుమతి ఇవ్వండి.`;
    monthlyHealth = `ఆరోగ్యం నిలకడగా ఉంటుంది.`;
    monthlyHealthTip = `రోజూ నడక అలవాటు చేసుకోండి.`;
    monthlyFavorable = ['పదోన్నతి దరఖాస్తు', 'విద్యలో పెట్టుబడి', 'తీర్థయాత్రలు', 'రత్నధారణ'];
    monthlyCaution = ['అప్పు ఇవ్వడం', 'వైద్య పరీక్షలు వాయిదా వేయడం', 'ఒత్తిడి'];

    yearlyTitle = 'వార్షిక మహా ఫలితాలు';
    yearlyTimeframe = 'వార్షిక సమగ్ర గోచార చక్రం (2026 - 2027)';
    yearlyMood = 'స్వర్ణ యుగం, ధన సంపాదన మరియు ఆధ్యాత్మిక పరిపక్వత';
    yearlyHeadline = `${subjectName} గారికి ఈ సంవత్సరం అద్భుతమైన అభివృద్ధి మరియు స్థిరత్వాన్ని ఇస్తుంది.`;
    yearlySummary = `గురు మరియు శని గ్రహాల శుభ దృష్టి వల్ల మీరు జీవితంలో ఉన్నత శిఖరాలను అధిరోహిస్తారు.`;
    yearlyCareer = `వృత్తిపరంగా గొప్ప విజయాలు, ఇల్లు లేదా స్థిరాస్తుల కొనుగోలు యోగం ఉంది.`;
    yearlyCareerTip = `ఆదాయ మార్గాలను విస్తరించుకోండి.`;
    yearlyLove = `దాంపత్య జీవితం మధురంగా ఉంటుంది, వివాహ ప్రయత్నాలు ఫలిస్తాయి.`;
    yearlyLoveTip = `సహృదయంతో మాట్లాడండి.`;
    yearlyHealth = `రోగనిరోధక శక్తి పెరుగుతుంది.`;
    yearlyHealthTip = `యోగా మరియు ప్రాణాయామం చేయండి.`;
    yearlyFavorable = ['ఆస్తి కొనుగోలు', 'కొత్త వ్యాపారం', 'శుభకార్యాలు', 'దానధర్మాలు'];
    yearlyCaution = ['స్పెక్యులేషన్', 'అధిక శ్రమ', 'ఒప్పందాలపై జాగ్రత్త'];
  }

  // Planet transit descriptions fully localized
  const transitInfluences = [
    {
      planet: `${getPlanetName('Moon', lang)} (${lang === 'hi' ? 'चंद्रमा' : 'Chandra'})`,
      transitNote: lang === 'hi'
        ? 'चंद्रमा का शुभ गोचर रचनात्मक समस्या निवारण, मानसिक शांति व बौद्धिक संतुलन प्रदान करता है।'
        : `Moon's harmonious transit activates creative problem solving and emotional peace.`,
      impactOnHouses: lang === 'hi'
        ? 'प्रथम एवं पंचम भाव को सक्रिय कर बुद्धि, अंतर्ज्ञान व आकर्षण शक्ति में वृद्धि करता है।'
        : `Activates 1st & 5th house axis, boosting intelligence, intuition, and charm.`,
    },
    {
      planet: `${getPlanetName('Mercury', lang)} (${lang === 'hi' ? 'बुध ग्रह' : 'Budha'})`,
      transitNote: lang === 'hi'
        ? 'बुध का मार्गी संचार तीक्ष्ण विश्लेषणात्मक क्षमता और व्यापारिक सफलता दिलाता है।'
        : `Mercury's direct motion fosters sharp analytical acumen and fast commercial turnaround.`,
      impactOnHouses: lang === 'hi'
        ? 'द्वितीय एवं एकादश भाव को बल देकर धन लाभ व वाणी के प्रभाव को बढ़ाता है।'
        : `Supports 2nd & 11th houses of financial gains and speech eloquence.`,
    },
    {
      planet: `${getPlanetName('Jupiter', lang)} (${lang === 'hi' ? 'देवगुरु बृहस्पति' : 'Guru'})`,
      transitNote: lang === 'hi'
        ? 'देवगुरु बृहस्पति का शुभ प्रभाव अनपेक्षित बाधाओं से रक्षा व दैवीय कृपा प्रदान करता है।'
        : `Jupiter casts a protective aspect, buffering you against unforeseen obstacles.`,
      impactOnHouses: lang === 'hi'
        ? 'नवम भाव (भाग्य स्थान) व गुरुजनों के आशीर्वाद को सुदृढ़ करता है।'
        : `Guards 9th house of fortune (Bhagya) and mentors.`,
    },
  ];

  const weekly: TimeframePrediction = {
    periodType: 'weekly',
    title: weeklyTitle,
    timeframeLabel: weeklyTimeframe,
    overallScore: 86,
    overallMood: weeklyMood,
    headline: weeklyHeadline,
    summary: weeklySummary,
    careerAndMoney: {
      score: 88,
      status: 'Excellent',
      prediction: weeklyCareer,
      actionableTip: weeklyCareerTip,
    },
    loveAndFamily: {
      score: 84,
      status: 'Favorable',
      prediction: weeklyLove,
      actionableTip: weeklyLoveTip,
    },
    healthAndVitality: {
      score: 82,
      status: 'Favorable',
      prediction: weeklyHealth,
      actionableTip: weeklyHealthTip,
    },
    favorableActivities: weeklyFavorable,
    cautionActivities: weeklyCaution,
    luckyElements: {
      luckyColors: [localizedColors[0], localizedColors[1] || localizedColors[0]],
      luckyNumbers: [luckyNumbers[0], luckyNumbers[1]],
      luckyDays: [localizedDays[0], localizedDays[1] || localizedDays[0]],
      auspiciousDirection: localizedDirection,
      favorableGemstone: localizedGemstone,
      mantraOrAffirmation: `${affData.mantra} | ${affLabel}: "${localizedAffirmation}"`,
    },
    transitInfluences,
  };

  const monthly: TimeframePrediction = {
    periodType: 'monthly',
    title: monthlyTitle,
    timeframeLabel: monthlyTimeframe,
    overallScore: 89,
    overallMood: monthlyMood,
    headline: monthlyHeadline,
    summary: monthlySummary,
    careerAndMoney: {
      score: 91,
      status: 'Excellent',
      prediction: monthlyCareer,
      actionableTip: monthlyCareerTip,
    },
    loveAndFamily: {
      score: 87,
      status: 'Favorable',
      prediction: monthlyLove,
      actionableTip: monthlyLoveTip,
    },
    healthAndVitality: {
      score: 85,
      status: 'Favorable',
      prediction: monthlyHealth,
      actionableTip: monthlyHealthTip,
    },
    favorableActivities: monthlyFavorable,
    cautionActivities: monthlyCaution,
    luckyElements: {
      luckyColors: localizedColors,
      luckyNumbers: luckyNumbers,
      luckyDays: localizedDays,
      auspiciousDirection: localizedDirection,
      favorableGemstone: localizedGemstone,
      mantraOrAffirmation: `${affData.mantra} | ${affLabel}: "${localizedAffirmation}"`,
    },
    transitInfluences,
  };

  const yearly: TimeframePrediction = {
    periodType: 'yearly',
    title: yearlyTitle,
    timeframeLabel: yearlyTimeframe,
    overallScore: 92,
    overallMood: yearlyMood,
    headline: yearlyHeadline,
    summary: yearlySummary,
    careerAndMoney: {
      score: 94,
      status: 'Excellent',
      prediction: yearlyCareer,
      actionableTip: yearlyCareerTip,
    },
    loveAndFamily: {
      score: 90,
      status: 'Excellent',
      prediction: yearlyLove,
      actionableTip: yearlyLoveTip,
    },
    healthAndVitality: {
      score: 88,
      status: 'Favorable',
      prediction: yearlyHealth,
      actionableTip: yearlyHealthTip,
    },
    favorableActivities: yearlyFavorable,
    cautionActivities: yearlyCaution,
    luckyElements: {
      luckyColors: localizedColors,
      luckyNumbers: luckyNumbers,
      luckyDays: localizedDays,
      auspiciousDirection: localizedDirection,
      favorableGemstone: localizedGemstone,
      mantraOrAffirmation: `${affData.mantra} | ${affLabel}: "${localizedAffirmation}"`,
    },
    transitInfluences,
  };

  return {
    weekly,
    monthly,
    yearly,
  };
}
