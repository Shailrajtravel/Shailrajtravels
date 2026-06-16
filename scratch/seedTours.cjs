const { MongoClient } = require('mongodb');
const fs = require('fs');

const toursEn = [
  {
    lang: 'en',
    slug: 'ashtavinayak-yatra',
    title: 'Ashtavinayak Yatra',
    metaTitle: 'Ashtavinayak Yatra Package | Shailraj Travels',
    metaDescription: 'Book Ashtavinayak Yatra with AC bus, guided darshan & stay. Trusted pilgrimage tours from Pune. Call Shailraj Travels today.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/ashtavinayak-yatra',
    heroContent: {
      image: '/images/ashtavinayak.jpg', // Placeholder image
      mobileImage: '/images/ashtavinayak-mobile.jpg',
      description: 'Visit all 8 sacred Ganesha temples in Maharashtra with our premium AC bus package from Pune.'
    },
    overview: '<p>The Ashtavinayak Yatra covers eight ancient holy temples of Ganesha which are situated around Pune. Each of these temples has its own individual legend and history.</p>',
    highlights: [
      'AC Bus Travel from Pune',
      'Comfortable 1-night accommodation'
    ],
    destinations: ['Moreshwar', 'Siddhivinayak', 'Ballaleshwar', 'Varadvinayak', 'Chintamani', 'Girijatmaj', 'Vighneshwar', 'Mahaganapati'],
    packages: [
      {
        title: 'Standard AC Package',
        price: '4500',
        inclusions: ['AC Bus', 'Standard Hotel'],
        exclusions: ['Personal Expenses', 'Prasad Offerings']
      }
    ],
    faq: [
      { question: 'What is included in the Ashtavinayak Yatra package?', answer: 'The package includes AC bus travel from Pune, 1 night accommodation.' },
      { question: 'How many days does the Ashtavinayak Yatra take?', answer: 'The complete tour takes 2 days and 1 night from Pune.' },
      { question: 'Can senior citizens join the tour?', answer: 'Absolutely. Our buses are comfortable and our guides assist senior citizens at the temples.' },
      { question: 'What is the best time for Ashtavinayak Yatra?', answer: 'The best time is between August to March when the weather is pleasant.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Yes, the itinerary is perfectly paced for families and children.' },
      { question: 'What transport is used?', answer: 'We use premium AC pushback 2x2 or 2x1 buses depending on group size.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'You can book by paying an advance. Cancellations made 7 days prior get a full refund.' }
    ],
    relatedTours: [
      { title: 'Jyotirlinga Darshan', slug: 'jyotirlinga-darshan' },
      { title: 'Pandharpur Wari', slug: 'pandharpur-wari' }
    ],
    relatedBlogs: [
      { title: 'Complete Ashtavinayak Yatra Guide 2026', slug: 'ashtavinayak-yatra-complete-guide' }
    ]
  },
  {
    lang: 'en',
    slug: 'jyotirlinga-darshan',
    title: 'Jyotirlinga Darshan',
    metaTitle: '12 Jyotirlinga Darshan Tour Package | Shailraj Travels',
    metaDescription: 'Explore all 12 Jyotirlinga temples with comfortable travel & guided darshan. Book Jyotirlinga tour packages from Pune with Shailraj Travels.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/jyotirlinga-darshan',
    heroContent: {
      image: '/images/jyotirlinga.jpg',
      description: 'Embark on the ultimate spiritual journey covering the 12 Jyotirlingas of Lord Shiva across India.'
    },
    overview: '<p>Our carefully planned Jyotirlinga Darshan packages offer a peaceful and organized spiritual journey to the most revered Shiva temples in the country.</p>',
    highlights: ['Premium accommodations', 'Local AC transport', 'Darshan assistance'],
    destinations: ['Somnath', 'Nageshwar', 'Bhimashankar', 'Trimbakeshwar', 'Grishneshwar', 'Vaidyanath', 'Mahakaleshwar', 'Omkareshwar', 'Kashi Vishwanath', 'Kedarnath', 'Rameshwaram', 'Mallikarjuna'],
    packages: [
      {
        title: 'Maharashtra 5 Jyotirlinga',
        price: '9500',
        inclusions: ['AC Transport from Pune', 'Hotel Stay', 'Guide'],
        exclusions: []
      }
    ],
    faq: [
      { question: 'What is included in the Jyotirlinga Darshan package?', answer: 'Travel, stay and darshan arrangements are completely taken care of.' },
      { question: 'How many days does the Jyotirlinga Darshan take?', answer: 'The Maharashtra 5 Jyotirlinga takes 4 days. All 12 takes about 18-20 days.' },
      { question: 'Can senior citizens join the tour?', answer: 'Yes, special care and assistance are provided for seniors.' },
      { question: 'What is the best time for Jyotirlinga Darshan?', answer: 'September to March is generally best, avoiding peak monsoons.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Yes, it is family friendly.' },
      { question: 'What transport is used?', answer: 'AC Buses for Maharashtra.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'Bookings require 50% advance. Cancellation policy varies by package.' }
    ],
    relatedTours: [
      { title: 'Ashtavinayak Yatra', slug: 'ashtavinayak-yatra' },
      { title: 'Char Dham Yatra', slug: 'char-dham-yatra' }
    ],
    relatedBlogs: [
      { title: 'All 12 Jyotirlinga Temples: Complete Information', slug: 'all-12-jyotirlinga-information' }
    ]
  },
  {
    lang: 'en',
    slug: 'pandharpur-wari',
    title: 'Pandharpur Wari',
    metaTitle: 'Pandharpur Wari Yatra Package | Shailraj Travels',
    metaDescription: 'Join Pandharpur Wari Yatra with comfortable bus travel & guided darshan. Book Wari pilgrimage packages from Pune. Call us today.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/pandharpur-wari',
    heroContent: {
      image: '/images/pandharpur.jpg',
      description: 'Experience the devotion of the Pandharpur Wari with our perfectly organized travel packages.'
    },
    overview: '<p>The Pandharpur Wari is a magnificent pilgrimage of devotion. We provide hassle-free transport and stay so you can focus entirely on Vitthal darshan.</p>',
    highlights: ['Direct AC Bus to Pandharpur', 'Comfortable Stay', 'Fasting food arrangements if needed', 'Guided Darshan'],
    destinations: ['Pandharpur'],
    packages: [
      {
        title: 'Ashadhi Ekadashi Special',
        price: '3500',
        inclusions: ['Bus Travel', '1 Night Stay', 'Meals'],
        exclusions: ['Special VIP Darshan tickets (if applicable)']
      }
    ],
    faq: [
      { question: 'What is included in the Pandharpur Wari package?', answer: 'Travel, stay, and food.' },
      { question: 'How many days does the Pandharpur Wari tour take?', answer: 'Usually 2 Days and 1 Night from Pune.' },
      { question: 'Is food and accommodation included?', answer: 'Yes.' },
      { question: 'Can senior citizens join the tour?', answer: 'Yes, we provide comfortable seating and assistance.' },
      { question: 'What is the best time for Pandharpur Wari?', answer: 'Ashadhi and Kartiki Ekadashi are the main events.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Yes.' },
      { question: 'What transport is used?', answer: 'AC Pushback Buses.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'Advance booking is required due to high demand.' }
    ],
    relatedTours: [
      { title: 'Ashtavinayak Yatra', slug: 'ashtavinayak-yatra' },
      { title: 'Shirdi Tour', slug: 'shirdi-tour' }
    ],
    relatedBlogs: [
      { title: 'Pandharpur Wari Yatra 2026 — Dates, Route, Tips', slug: 'pandharpur-wari-yatra-2026' }
    ]
  },
  {
    lang: 'en',
    slug: 'char-dham-yatra',
    title: 'Char Dham Yatra',
    metaTitle: 'Char Dham Yatra Package from Pune | Shailraj Travels',
    metaDescription: 'Book Char Dham Yatra with flights, accommodation & guided darshan. Kedarnath, Badrinath, Gangotri, Yamunotri — book now.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/char-dham-yatra',
    heroContent: {
      image: '/images/chardham.jpg',
      description: 'A life-transforming journey to the Himalayas covering Kedarnath, Badrinath, Gangotri, and Yamunotri.'
    },
    overview: '<p>The complete Char Dham yatra package starting from Pune, managing all flights, local transport, helicopter tickets, and premium stays in Uttarakhand.</p>',
    highlights: ['Pune to Delhi Flights', 'Helicopter booking assistance for Kedarnath', 'Premium Hotels', 'Medical assistance on standby'],
    destinations: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
    packages: [
      {
        title: 'Complete Char Dham (12 Days)',
        price: '35000',
        inclusions: ['Flights', 'Hotels', 'All Meals', 'Local Transport'],
        exclusions: ['Helicopter tickets', 'Pony/Palki charges']
      }
    ],
    faq: [
      { question: 'What is included in the Char Dham Yatra package?', answer: 'Flights from Pune, hotels, food, and local transport.' },
      { question: 'How many days does the Char Dham Yatra take?', answer: '12 to 14 days.' },
      { question: 'Is food and accommodation included?', answer: 'Yes, premium stays and pure veg food.' },
      { question: 'Can senior citizens join the tour?', answer: 'Yes, but a medical fitness certificate is highly recommended.' },
      { question: 'What is the best time for Char Dham Yatra?', answer: 'May-June and September-October.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Older children yes, very young infants are not recommended due to altitude.' },
      { question: 'What transport is used?', answer: 'Flights to Dehradun/Delhi, followed by Innova/Tempo Traveller.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'Early booking is required. Cancellation terms apply.' }
    ],
    relatedTours: [
      { title: 'Jyotirlinga Darshan', slug: 'jyotirlinga-darshan' }
    ],
    relatedBlogs: [
      { title: 'Char Dham Yatra Travel Tips for First-Timers', slug: 'char-dham-yatra-tips' }
    ]
  },
  {
    lang: 'en',
    slug: 'shirdi-tour',
    title: 'Shirdi Tour',
    metaTitle: 'Shirdi Tour Package from Pune | Shailraj Travels',
    metaDescription: 'One day & overnight Shirdi tour packages from Pune with AC travel & Sai Baba darshan assistance. Book with Shailraj Travels.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/shirdi-tour',
    heroContent: {
      image: '/images/shirdi.jpg',
      description: 'Peaceful Shirdi Sai Baba darshan tour from Pune, including Shani Shingnapur.'
    },
    overview: '<p>Convenient one-day and overnight tour packages from Pune to Shirdi and Shani Shingnapur.</p>',
    highlights: ['AC Travel from Pune', 'VIP Darshan pass assistance', 'Visit to Shani Shingnapur'],
    destinations: ['Shirdi', 'Shani Shingnapur'],
    packages: [
      {
        title: 'Shirdi 1 Day Tour',
        price: '1500',
        inclusions: ['AC Bus Travel', 'Breakfast & Lunch'],
        exclusions: ['VIP Darshan Tickets']
      }
    ],
    faq: [
      { question: 'What is included in the Shirdi Tour package?', answer: 'Travel and meals.' },
      { question: 'How many days does the Shirdi Tour take?', answer: '1 Day or 2 Day options available.' },
      { question: 'Is food and accommodation included?', answer: 'Yes, based on package selected.' },
      { question: 'Can senior citizens join the tour?', answer: 'Yes.' },
      { question: 'What is the best time for Shirdi Tour?', answer: 'Year-round.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Yes.' },
      { question: 'What transport is used?', answer: 'AC Bus or Private Car.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'Book online or via WhatsApp.' }
    ],
    relatedTours: [
      { title: 'Ashtavinayak Yatra', slug: 'ashtavinayak-yatra' },
      { title: 'Pandharpur Wari', slug: 'pandharpur-wari' }
    ],
    relatedBlogs: [
      { title: 'Shirdi Darshan Guide: How to Book, Best Time, Tips', slug: 'shirdi-darshan-guide' }
    ]
  },
  {
    lang: 'en',
    slug: 'tirupati-balaji-tour',
    title: 'Tirupati Balaji Tour',
    metaTitle: 'Tirupati Balaji Tour from Pune | Shailraj Travels',
    metaDescription: 'Book Tirupati Balaji darshan tour from Pune with flight, stay & VIP darshan tickets. Trusted pilgrimage operator — Shailraj Travels.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/tirupati-balaji-tour',
    heroContent: {
      image: '/images/tirupati.jpg',
      description: 'Hassle-free Tirupati Balaji Darshan packages from Pune with confirmed VIP tickets.'
    },
    overview: '<p>Getting Tirupati Balaji darshan tickets can be difficult. We manage flights, local transport, accommodation, and guaranteed darshan passes.</p>',
    highlights: ['Direct Flights from Pune', 'Confirmed VIP Darshan', 'Premium AC Stay', 'Local Sightseeing'],
    destinations: ['Tirupati', 'Tirumala', 'Kalahasti'],
    packages: [
      {
        title: 'Tirupati Flight Package (2N/3D)',
        price: '16500',
        inclusions: ['Return Flights', 'AC Hotel', 'Special Entry Darshan', 'Local Cabs'],
        exclusions: ['Personal Expenses']
      }
    ],
    faq: [
      { question: 'What is included in the Tirupati Tour package?', answer: 'Flights, hotel, cabs, and Darshan tickets.' },
      { question: 'How many days does the Tirupati Tour take?', answer: '3 Days and 2 Nights.' },
      { question: 'Is food and accommodation included?', answer: 'Accommodation is included. Breakfast is included.' },
      { question: 'Can senior citizens join the tour?', answer: 'Yes, special queue access is arranged if eligible.' },
      { question: 'What is the best time for Tirupati Tour?', answer: 'Year-round.' },
      { question: 'Is the tour suitable for families with children?', answer: 'Yes.' },
      { question: 'What transport is used?', answer: 'Flights from Pune, AC Sedans locally.' },
      { question: 'How do I book and what is the cancellation policy?', answer: 'Darshan tickets are non-refundable once booked.' }
    ],
    relatedTours: [
      { title: 'Jyotirlinga Darshan', slug: 'jyotirlinga-darshan' }
    ],
    relatedBlogs: [
      { title: 'Tirupati Balaji Darshan: VIP Tickets, Travel Guide', slug: 'tirupati-darshan-guide' }
    ]
  }
];

const toursMr = [
  {
    lang: 'mr',
    slug: 'ashtavinayak-yatra',
    title: 'अष्टविनायक यात्रा',
    metaTitle: 'अष्टविनायक यात्रा पॅकेज | शैलराज ट्रॅव्हल्स',
    metaDescription: 'एसी बस, मार्गदर्शित दर्शन आणि मुक्कामासह अष्टविनायक यात्रा बुक करा. पुण्यातील विश्वसनीय तीर्थयात्रा ऑपरेटर.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/ashtavinayak-yatra',
    heroContent: {
      image: '/images/ashtavinayak.jpg',
      mobileImage: '/images/ashtavinayak-mobile.jpg',
      description: 'पुण्याहून आमच्या प्रीमियम एसी बस पॅकेजसह महाराष्ट्रातील सर्व ८ पवित्र गणेश मंदिरांना भेट द्या.'
    },
    overview: '<p>अष्टविनायक यात्रेमध्ये पुण्याजवळील आठ प्राचीन पवित्र गणेश मंदिरांचा समावेश आहे. यापैकी प्रत्येक मंदिराची स्वतःची वेगळी आख्यायिका आणि इतिहास आहे.</p>',
    highlights: [
      'पुण्याहून एसी बसने प्रवास',
      '१ रात्रीसाठी आरामदायी मुक्काम'
    ],
    destinations: ['मोरेश्वर', 'सिद्धिविनायक', 'बल्लाळेश्वर', 'वरदविनायक', 'चिंतामणी', 'गिरिजात्मज', 'विघ्नेश्वर', 'महागणपती'],
    packages: [
      {
        title: 'स्टँडर्ड एसी पॅकेज',
        price: '४५००',
        inclusions: ['एसी बस', 'स्टँडर्ड हॉटेल'],
        exclusions: ['वैयक्तिक खर्च', 'प्रसाद']
      }
    ],
    faq: [
      { question: 'अष्टविनायक यात्रा पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'पॅकेजमध्ये पुण्याहून एसी बस प्रवास आणि १ रात्रीचा मुक्काम समाविष्ट आहे.' },
      { question: 'अष्टविनायक यात्रेसाठी किती दिवस लागतात?', answer: 'पुण्याहून या संपूर्ण यात्रेसाठी २ दिवस आणि १ रात्र लागते.' },
      { question: 'ज्येष्ठ नागरिक या टूरमध्ये सहभागी होऊ शकतात का?', answer: 'होय, आमच्या बस आरामदायी आहेत आणि आमचे मार्गदर्शक मंदिरांमध्ये ज्येष्ठ नागरिकांना मदत करतात.' },
      { question: 'अष्टविनायक यात्रेसाठी सर्वोत्तम वेळ कोणती?', answer: 'ऑगस्ट ते मार्च दरम्यानचा काळ प्रवासासाठी सर्वोत्तम मानला जातो.' }
    ],
    relatedTours: [
      { title: 'ज्योतिर्लिंग दर्शन', slug: 'jyotirlinga-darshan' },
      { title: 'पंढरपूर वारी', slug: 'pandharpur-wari' }
    ],
    relatedBlogs: [
      { title: 'अष्टविनायक यात्रा संपूर्ण मार्गदर्शक २०२६', slug: 'ashtavinayak-yatra-complete-guide' }
    ]
  },
  {
    lang: 'mr',
    slug: 'jyotirlinga-darshan',
    title: 'ज्योतिर्लिंग दर्शन',
    metaTitle: '१२ ज्योतिर्लिंग दर्शन टूर पॅकेज | शैलराज ट्रॅव्हल्स',
    metaDescription: 'आरामदायी प्रवासासह सर्व १२ ज्योतिर्लिंग मंदिरांचे दर्शन घ्या. पुण्याहून ज्योतिर्लिंग टूर पॅकेजेस बुक करा.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/jyotirlinga-darshan',
    heroContent: {
      image: '/images/jyotirlinga.jpg',
      description: 'भारतभरातील भगवान शिवाच्या १२ ज्योतिर्लिंगांचा अंतिम आध्यात्मिक प्रवास करा.'
    },
    overview: '<p>आमचे ज्योतिर्लिंग दर्शन पॅकेजेस देशातील सर्वात आदरणीय शिव मंदिरांचा एक शांत आणि सुव्यवस्थित आध्यात्मिक प्रवास प्रदान करतात.</p>',
    highlights: ['प्रीमियम मुक्काम', 'स्थानिक एसी प्रवास', 'दर्शनासाठी सहाय्य'],
    destinations: ['सोमनाथ', 'नागेश्वर', 'भीमाशंकर', 'त्र्यंबकेश्वर', 'घृष्णेश्वर', 'वैद्यनाथ', 'महाकालेश्वर', 'ओंकारेश्वर', 'काशी विश्वनाथ', 'केदारनाथ', 'रामेश्वरम', 'मल्लिकार्जुन'],
    packages: [
      {
        title: 'महाराष्ट्र ५ ज्योतिर्लिंग',
        price: '९५००',
        inclusions: ['पुण्याहून एसी वाहतूक', 'हॉटेल मुक्काम', 'मार्गदर्शक'],
        exclusions: []
      }
    ],
    faq: [
      { question: 'ज्योतिर्लिंग दर्शन पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'प्रवास, मुक्काम आणि दर्शनाची संपूर्ण व्यवस्था केली जाते.' },
      { question: 'ज्योतिर्लिंग दर्शनासाठी किती दिवस लागतात?', answer: 'महाराष्ट्र ५ ज्योतिर्लिंगांसाठी ४ दिवस लागतात. सर्व १२ ज्योतिर्लिंगांसाठी सुमारे १८-२० दिवस लागतात.' },
      { question: 'ज्येष्ठ नागरिक या टूरमध्ये सहभागी होऊ शकतात का?', answer: 'होय, ज्येष्ठांसाठी विशेष काळजी आणि मदत पुरवली जाते.' }
    ],
    relatedTours: [
      { title: 'अष्टविनायक यात्रा', slug: 'ashtavinayak-yatra' },
      { title: 'चार धाम यात्रा', slug: 'char-dham-yatra' }
    ],
    relatedBlogs: [
      { title: 'सर्व १२ ज्योतिर्लिंग मंदिरे: संपूर्ण माहिती', slug: 'all-12-jyotirlinga-information' }
    ]
  },
  {
    lang: 'mr',
    slug: 'pandharpur-wari',
    title: 'पंढरपूर वारी',
    metaTitle: 'पंढरपूर वारी यात्रा पॅकेज | शैलराज ट्रॅव्हल्स',
    metaDescription: 'आरामदायी बस प्रवास आणि मार्गदर्शित दर्शनासह पंढरपूर वारी यात्रेत सहभागी व्हा. पुण्याहून वारी तीर्थयात्रा पॅकेजेस बुक करा.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/pandharpur-wari',
    heroContent: {
      image: '/images/pandharpur.jpg',
      description: 'आमच्या उत्तम प्रकारे आयोजित केलेल्या प्रवास पॅकेजेससह पंढरपूर वारीच्या भक्तीचा अनुभव घ्या.'
    },
    overview: '<p>पंढरपूर वारी ही भक्तीची एक भव्य तीर्थयात्रा आहे. आम्ही त्रासमुक्त वाहतूक आणि मुक्काम प्रदान करतो जेणेकरून तुम्ही विठ्ठल दर्शनावर पूर्णपणे लक्ष केंद्रित करू शकाल.</p>',
    highlights: ['पंढरपूरसाठी थेट एसी बस', 'आरामदायी मुक्काम', 'उपवासाच्या अन्नाची व्यवस्था', 'मार्गदर्शित दर्शन'],
    destinations: ['पंढरपूर'],
    packages: [
      {
        title: 'आषाढी एकादशी विशेष',
        price: '३५००',
        inclusions: ['बस प्रवास', '१ रात्रीचा मुक्काम', 'जेवण'],
        exclusions: ['विशेष व्हीआयपी दर्शन तिकीट (लागू असल्यास)']
      }
    ],
    faq: [
      { question: 'पंढरपूर वारी पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'प्रवास, मुक्काम आणि जेवण.' },
      { question: 'पंढरपूर वारी टूरसाठी किती दिवस लागतात?', answer: 'पुण्याहून साधारणपणे २ दिवस आणि १ रात्र.' }
    ],
    relatedTours: [
      { title: 'अष्टविनायक यात्रा', slug: 'ashtavinayak-yatra' },
      { title: 'शिर्डी टूर', slug: 'shirdi-tour' }
    ],
    relatedBlogs: [
      { title: 'पंढरपूर वारी यात्रा २०२६', slug: 'pandharpur-wari-yatra-2026' }
    ]
  },
  {
    lang: 'mr',
    slug: 'char-dham-yatra',
    title: 'चार धाम यात्रा',
    metaTitle: 'चार धाम यात्रा पॅकेज | शैलराज ट्रॅव्हल्स',
    metaDescription: 'विमानप्रवास, मुक्काम आणि मार्गदर्शित दर्शनासह चार धाम यात्रा बुक करा.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/char-dham-yatra',
    heroContent: {
      image: '/images/chardham.jpg',
      description: 'केदारनाथ, बद्रीनाथ, गंगोत्री आणि यमुनोत्रीचा हिमालयातील जीवन बदलणारा प्रवास.'
    },
    overview: '<p>पुण्यापासून सुरू होणारे संपूर्ण चार धाम यात्रा पॅकेज, ज्यामध्ये उड्डाणे, स्थानिक वाहतूक, हेलिकॉप्टर तिकीट आणि उत्तराखंडमधील प्रीमियम मुक्काम व्यवस्थापित केला जातो.</p>',
    highlights: ['पुणे ते दिल्ली विमानप्रवास', 'केदारनाथसाठी हेलिकॉप्टर बुकिंग', 'प्रीमियम हॉटेल्स', 'वैद्यकीय मदत'],
    destinations: ['यमुनोत्री', 'गंगोत्री', 'केदारनाथ', 'बद्रीनाथ'],
    packages: [
      {
        title: 'संपूर्ण चार धाम (१२ दिवस)',
        price: '३५०००',
        inclusions: ['विमान', 'हॉटेल्स', 'सर्व जेवण', 'स्थानिक वाहतूक'],
        exclusions: ['हेलिकॉप्टर तिकीट', 'पोनी/पालखी खर्च']
      }
    ],
    faq: [
      { question: 'चार धाम यात्रा पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'पुण्याहून उड्डाणे, हॉटेल्स, जेवण आणि स्थानिक वाहतूक.' },
      { question: 'चार धाम यात्रेसाठी किती दिवस लागतात?', answer: '१२ ते १४ दिवस.' }
    ],
    relatedTours: [
      { title: 'ज्योतिर्लिंग दर्शन', slug: 'jyotirlinga-darshan' }
    ],
    relatedBlogs: [
      { title: 'चार धाम यात्रा प्रवास टिप्स', slug: 'char-dham-yatra-tips' }
    ]
  },
  {
    lang: 'mr',
    slug: 'shirdi-tour',
    title: 'शिर्डी टूर',
    metaTitle: 'शिर्डी टूर पॅकेज | शैलराज ट्रॅव्हल्स',
    metaDescription: 'पुण्याहून एसी प्रवास आणि साईबाबा दर्शन सहाय्यासह एक दिवसाची शिर्डी टूर बुक करा.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/shirdi-tour',
    heroContent: {
      image: '/images/shirdi.jpg',
      description: 'शनि शिंगणापूरसह पुण्याहून शांततापूर्ण शिर्डी साईबाबा दर्शन टूर.'
    },
    overview: '<p>पुण्याहून शिर्डी आणि शनि शिंगणापूरसाठी सोयीस्कर एक दिवसीय आणि रात्रीची टूर पॅकेजेस.</p>',
    highlights: ['पुण्याहून एसी प्रवास', 'व्हीआयपी दर्शन पास सहाय्य', 'शनि शिंगणापूरला भेट'],
    destinations: ['शिर्डी', 'शनि शिंगणापूर'],
    packages: [
      {
        title: 'शिर्डी १ दिवसाची टूर',
        price: '१५००',
        inclusions: ['एसी बस प्रवास', 'नाश्ता आणि दुपारचे जेवण'],
        exclusions: ['व्हीआयपी दर्शन तिकीट']
      }
    ],
    faq: [
      { question: 'शिर्डी टूर पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'प्रवास आणि जेवण.' },
      { question: 'शिर्डी टूरसाठी किती दिवस लागतात?', answer: '१ दिवस किंवा २ दिवसाचे पर्याय उपलब्ध आहेत.' }
    ],
    relatedTours: [
      { title: 'अष्टविनायक यात्रा', slug: 'ashtavinayak-yatra' },
      { title: 'पंढरपूर वारी', slug: 'pandharpur-wari' }
    ],
    relatedBlogs: [
      { title: 'शिर्डी दर्शन मार्गदर्शक', slug: 'shirdi-darshan-guide' }
    ]
  },
  {
    lang: 'mr',
    slug: 'tirupati-balaji-tour',
    title: 'तिरुपती बालाजी दर्शन',
    metaTitle: 'तिरुपती बालाजी दर्शन टूर | शैलराज ट्रॅव्हल्स',
    metaDescription: 'विमान, मुक्काम आणि व्हीआयपी दर्शन तिकिटासह पुण्याहून तिरुपती बालाजी दर्शन टूर बुक करा.',
    canonicalUrl: 'https://www.shailrajtravels.com/tours/tirupati-balaji-tour',
    heroContent: {
      image: '/images/tirupati.jpg',
      description: 'निश्चित व्हीआयपी तिकिटांसह पुण्याहून त्रासमुक्त तिरुपती बालाजी दर्शन पॅकेजेस.'
    },
    overview: '<p>तिरुपती बालाजी दर्शनाची तिकिटे मिळणे कठीण असू शकते. आम्ही उड्डाणे, स्थानिक वाहतूक, निवास आणि खात्रीशीर दर्शन पास व्यवस्थापित करतो.</p>',
    highlights: ['पुण्याहून थेट उड्डाणे', 'निश्चित व्हीआयपी दर्शन', 'प्रीमियम एसी मुक्काम', 'स्थानिक प्रेक्षणीय स्थळे पाहणे'],
    destinations: ['तिरुपती', 'तिरुमला', 'कालहस्ती'],
    packages: [
      {
        title: 'तिरुपती फ्लाइट पॅकेज (२ रात्र/३ दिवस)',
        price: '१६५००',
        inclusions: ['परतीची उड्डाणे', 'एसी हॉटेल', 'विशेष दर्शन', 'स्थानिक कॅब'],
        exclusions: ['वैयक्तिक खर्च']
      }
    ],
    faq: [
      { question: 'तिरुपती टूर पॅकेजमध्ये काय समाविष्ट आहे?', answer: 'उड्डाणे, हॉटेल, कॅब आणि दर्शन तिकिटे.' },
      { question: 'तिरुपती टूरसाठी किती दिवस लागतात?', answer: '३ दिवस आणि २ रात्री.' }
    ],
    relatedTours: [
      { title: 'ज्योतिर्लिंग दर्शन', slug: 'jyotirlinga-darshan' }
    ],
    relatedBlogs: [
      { title: 'तिरुपती बालाजी दर्शन माहिती', slug: 'tirupati-darshan-guide' }
    ]
  }
];

const allTours = [...toursEn, ...toursMr];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('shailraj');
    const collection = db.collection('tours');

    await collection.deleteMany({});

    for (const tour of allTours) {
      tour.createdAt = new Date();
      await collection.insertOne(tour);
      console.log(`Inserted tour: ${tour.title} (${tour.lang})`);
    }

    console.log('Successfully seeded tours collection with both English and Marathi content!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed();
