class ChatbotService {
  private static instance: ChatbotService;

  private readonly responses: { [key: string]: string[] } = {
    'merhaba': [
      'Merhaba! Size nasıl yardımcı olabilirim?',
      'Hoş geldiniz! Sağlık konusunda sorularınızı yanıtlamak için buradayım.',
      'Merhaba! Bugün size nasıl yardımcı olabilirim?'
    ],
    'randevu': [
      'Randevu almak için ana sayfadaki "Randevu Al" butonuna tıklayabilirsiniz.',
      'Randevu işlemleri için lütfen ana sayfadaki randevu bölümünü kullanın.',
      'Size en uygun zamanı seçmek için randevu sayfasını ziyaret edebilirsiniz.'
    ],
    'uzman': [
      'Uzmanlarımız hakkında bilgi almak için "Uzmanlar" sayfasını ziyaret edebilirsiniz.',
      'Tüm uzmanlarımızın detaylı bilgilerine ana sayfadaki uzmanlar bölümünden ulaşabilirsiniz.',
      'Uzman kadromuz hakkında bilgi almak için uzmanlar sayfasını inceleyebilirsiniz.'
    ],
    'sağlık': [
      'Sağlıklı yaşam için düzenli egzersiz yapmanızı ve dengeli beslenmenizi öneririm.',
      'Sağlıklı bir yaşam için günde en az 8 saat uyku ve düzenli spor önemlidir.',
      'Sağlığınız için düzenli check-up yaptırmanızı ve doktor kontrollerinizi aksatmamanızı öneririm.'
    ],
    'beslenme': [
      'Dengeli beslenme için protein, karbonhidrat ve yağları yeterli miktarda tüketmelisiniz.',
      'Günde en az 2 litre su içmeyi ve meyve-sebze tüketimine özen göstermeyi unutmayın.',
      'Sağlıklı beslenme için işlenmiş gıdalardan uzak durup, doğal besinleri tercih etmelisiniz.'
    ],
    'spor': [
      'Haftada en az 3 gün 30 dakika egzersiz yapmanızı öneririm.',
      'Spor yaparken vücudunuzu dinlemeyi ve aşırıya kaçmamayı unutmayın.',
      'Düzenli spor yapmak hem fiziksel hem de mental sağlığınız için çok faydalıdır.'
    ],
    'teşekkür': [
      'Rica ederim! Başka bir sorunuz olursa yardımcı olmaktan mutluluk duyarım.',
      'Ne demek, her zaman yardımcı olmaya çalışırım!',
      'Rica ederim! Sağlıklı günler dilerim.'
    ],
    'görüşürüz': [
      'İyi günler! Tekrar görüşmek üzere.',
      'Sağlıklı günler! İhtiyacınız olursa yine buradayım.',
      'Hoşça kalın! Başka sorularınız olursa beklerim.'
    ]
  };

  private readonly defaultResponses: string[] = [
    'Üzgünüm, bu konuda size yardımcı olamıyorum. Lütfen başka bir soru sorun.',
    'Bu konu hakkında bilgim yok. Sağlık, beslenme veya spor konularında sorularınızı yanıtlayabilirim.',
    'Bu konuda size yardımcı olamıyorum. Sağlık danışmanı olarak sağlık, beslenme ve spor konularında bilgi verebilirim.'
  ];

  private constructor() {
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  private getRandomResponse(responses: string[]): string {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  public async processMessage(message: string): Promise<{ content: string }> {
    try {
      console.log('Mesaj işleniyor:', message);
      const lowerMessage = message.toLowerCase();

      // Anahtar kelimeleri kontrol et
      for (const [key, responses] of Object.entries(this.responses)) {
        if (lowerMessage.includes(key)) {
          const response = this.getRandomResponse(responses);
          console.log('Bulunan yanıt:', response);
          return { content: response };
        }
      }

      // Eğer anahtar kelime bulunamazsa varsayılan yanıtlardan birini seç
      const defaultResponse = this.getRandomResponse(this.defaultResponses);
      console.log('Varsayılan yanıt:', defaultResponse);
      return { content: defaultResponse };
    } catch (error) {
      console.error('Mesaj işleme hatası:', error);
      throw error;
    }
  }
}

export default ChatbotService; 