# 🎮 გამოიცანი ემოჯით (Guess the Emoji)

A fun and interactive emoji guessing game built with Angular 19 and Ionic Framework, featuring Georgian language support.

## 🚀 Features

- **Multiple Categories**: Animals, Food, Objects, Countries, Sports, Movies, and Books
- **Coin-Based Economy**: 
  - Start with 100 coins
  - Earn 30 coins for correct answers
  - Spend 10 coins for hints
  - Spend 50 coins to reveal answers
- **Progressive Difficulty**: Easy, Medium, Hard questions with different scoring
- **Mobile Optimized**: Responsive design with large emojis for mobile devices
- **Georgian Language**: Full Georgian UI and localization
- **Space-Efficient UX**: Toggle-based hint and answer system
- **Manual Progression**: Control when to move to the next question

## 🛠️ Technology Stack

- **Frontend**: Angular 19 with standalone components
- **UI Framework**: Ionic 8
- **Language**: TypeScript
- **Styling**: SCSS with custom animations and gradients
- **Build Tool**: Vite
- **Containerization**: Docker with multi-stage builds
- **Package Manager**: npm

## 🎯 Game Mechanics

### Scoring System
- **Easy Questions**: 10 points
- **Medium Questions**: 20 points  
- **Hard Questions**: 30 points

### Coin System
- **Starting Coins**: 100
- **Correct Answer**: +30 coins
- **Hint Cost**: -10 coins
- **Reveal Answer Cost**: -50 coins

### Categories Available
1. 🐾 **Animals** (ცხოველები)
2. 🍕 **Food** (საკვები)
3. 📱 **Objects** (ნივთები)
4. 🌍 **Countries** (ქვეყნები)
5. ⚽ **Sports** (სპორტი)
6. 🎬 **Movies** (ფილმები)
7. 📚 **Books** (წიგნები)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jaba25/emojii.git
   cd emojii
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ionic serve --port 8100
   ```

4. **Open in browser**
   ```
   http://localhost:8100
   ```

### Docker Development

1. **Run with Docker Compose**
   ```bash
   docker compose up
   ```

2. **Access the application**
   - Development: http://localhost:8100
   - Production: http://localhost:3000

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── game/              # Main game component
│   │   ├── home/              # Home page
│   │   └── category-select/   # Category selection
│   ├── services/
│   │   └── game.service.ts    # Game logic and state management
│   ├── interfaces/
│   │   └── game.interface.ts  # TypeScript interfaces
│   └── data/
│       └── questions.data.ts  # Game questions database
├── theme/
│   └── variables.scss         # Ionic theme variables
└── global.scss               # Global styles
```

## 🎨 Design Features

- **Glassmorphism Effects**: Modern glass-like UI elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Responsive Design**: Optimized for mobile and desktop
- **Touch-Friendly**: Large buttons and touch targets
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run docker:dev` - Run development Docker container
- `npm run docker:prod` - Run production Docker container

### Adding New Questions

Edit `src/app/data/questions.data.ts` to add new questions:

```typescript
{
  id: uniqueId,
  emojis: "🐶🦴",
  answer: "ძაღლი",
  hint: "ადამიანის საუკეთესო მეგობარი",
  difficulty: "easy",
  category: "animals"
}
```

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
docker compose up app-prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Mobile Support

The application is fully optimized for mobile devices with:
- Touch-friendly interface
- Large emoji display (5em on mobile)
- Responsive layout
- Mobile-specific styling
- Touch gesture support

## 🔮 Future Enhancements

- [ ] Multiplayer mode
- [ ] Leaderboards
- [ ] Achievement system
- [ ] Sound effects
- [ ] More categories
- [ ] Difficulty progression
- [ ] Social sharing
- [ ] Dark/Light theme toggle

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jaba25**
- GitHub: [@Jaba25](https://github.com/Jaba25)

## 🙏 Acknowledgments

- Ionic Framework team for the excellent mobile UI components
- Angular team for the robust framework
- Georgian language community for localization support

---

**Enjoy playing გამოიცანი ემოჯით! 🎉**
