class Chatbot {
    constructor() {
        this.messageContainer = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.chatContainer = document.querySelector('.chat-container');
        this.charCount = document.querySelector('.char-count');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.responses = {
            greetings: ['Bonjour', 'Salut', 'Hello', 'Bienvenue'],
            help: ['Comment puis-je vous aider', 'De quoi avez-vous besoin', 'Je suis la pour vous aider'],
            goodbye: ['Au revoir', 'A bientot', 'Bonne journee', 'A la prochaine'],
            thanks: ['Je vous en prie', 'Avec plaisir', 'C\'est normal', 'Heureux d\'aider']
        };
        
        this.init();
    }
    
    init() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.userInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });
        
        this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        
        this.autoResizeTextarea();
    }
    
    sendMessage() {
        const message = this.userInput.value.trim();
        
        if (message === '') return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${sender === 'bot' ? 'fa-robot' : 'fa-user'} message-icon"></i>
                <div class="message-bubble">
                    ${this.formatMessage(text)}
                </div>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" style="color: #667eea; text-decoration: underline;">${url}</a>`;
        });
        
        return text;
    }
    
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
            return this.getRandomResponse('greetings') + ' Comment allez-vous';
        }
        
        if (message.includes('aide') || message.includes('help') || message.includes('peux-tu')) {
            return this.getRandomResponse('help') + ' Je peux repondre a vos questions, discuter avec vous, ou vous aider avec diverses informations';
        }
        
        if (message.includes('merci') || message.includes('thanks')) {
            return this.getRandomResponse('thanks');
        }
        
        if (message.includes('au revoir') || message.includes('bye') || message.includes('a plus')) {
            return this.getRandomResponse('goodbye') + ' N\'hesitez pas a revenir si vous avez besoin d\'aide';
        }
        
        if (message.includes('comment ca va') || message.includes('ca va')) {
            return 'Je vais tres bien, merci de demander Et vous, comment allez-vous aujourd\'hui';
        }
        
        if (message.includes('nom')) {
            return 'Je suis un assistant virtuel cree pour vous aider. Vous pouvez m\'appeler simplement Assistant';
        }
        
        if (message.includes('heure')) {
            const now = new Date();
            return `Il est actuellement ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        if (message.includes('date')) {
            const now = new Date();
            return `Nous sommes le ${now.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
        }
        
        if (message.includes('blague')) {
            const jokes = [
                'Pourquoi les plongeurs plongent-ils toujours en arriere Parce que sinon ils tombent dans le bateau',
                'Que dit une imprimante jet d\'encre J\'ai un probleme de liquidite',
                'Pourquoi les elephants ne jouent-ils pas aux echecs Parce qu\'ils ne savent pas utiliser les tours'
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
        
        if (message.includes('meteo')) {
            return 'Je ne peux pas encore acceder aux donnees meteorologiques en temps reel, mais je vous recommande de consulter une application meteorologique pour des informations precises';
        }
        
        const defaultResponses = [
            'Interessant Pouvez-vous m\'en dire plus',
            'Je comprends. Comment puis-je vous aider avec cela',
            'Merci de partager cela avec moi. Voulez-vous que je vous aide avec autre chose',
            'C\'est une bonne question Je vais essayer de vous aider du mieux que je peux',
            'Je suis la pour vous ecouter et vous aider. Continuez'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }
    
    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
    
    updateCharCount() {
        const length = this.userInput.value.length;
        this.charCount.textContent = `${length}/500`;
        
        if (length >= 500) {
            this.userInput.maxLength = 500;
        }
    }
    
    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 100) + 'px';
    }
    
    toggleMinimize() {
        this.chatContainer.classList.toggle('minimized');
        
        if (this.chatContainer.classList.contains('minimized')) {
            this.messageContainer.style.display = 'none';
            this.chatInputArea = document.querySelector('.chat-input-area');
            this.chatInputArea.style.display = 'none';
        } else {
            this.messageContainer.style.display = 'flex';
            this.chatInputArea = document.querySelector('.chat-input-area');
            this.chatInputArea.style.display = 'block';
            setTimeout(() => this.scrollToBottom(), 100);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});