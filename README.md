# 😶‍🌫️ Marshmallow Game

Um jogo 3D inspirado no Crossy Road desenvolvido com Three.js e Vite. O jogador controla um personagem que deve atravessar ruas com tráfego de veículos, coletando pontos e evitando colisões.

![Game Screenshot](src/icon.png)

## 👾 Atividade Final de Computação Gráfica:

- **Professor**: Wellington della Mura
- **Alunos**: Weslem, Giovanni, Luis

## 🎮 Características do Jogo

- **Gráficos 3D**: Renderização em tempo real usando Three.js
- **Sistema de Pontuação**: Pontos baseados na distância percorrida
- **Sistema de Vidas**: 3 vidas com regeneração por pontuação
- **Efeitos Visuais**: Sistema de partículas para feedback visual
- **Sistema de Áudio**: Música de fundo e efeitos sonoros
- **Controles**: Teclado e botões touch para dispositivos móveis
- **Salvamento**: Melhor pontuação salva no localStorage

## 🕹️ Como Jogar

### Controles

**Teclado:**
- `↑` - Mover para frente
- `↓` - Mover para trás  
- `←` - Mover para esquerda
- `→` - Mover para direita
- `M` - Alternar mute/unmute

**Touch/Mouse:**
- Use os botões direcionais na tela

### Objetivo

- Atravesse as ruas evitando os veículos
- Colete pontos avançando para frente
- Mantenha suas 3 vidas
- Tente bater seu melhor score!

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm 

### Passos para Instalação

1. **Clone o repositório:**
   ```bash
   git https://github.com/WeslemCristiano/Jogo_3D_Marshmallow
   cd Jogo_3D_Marshmallow
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o jogo em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse o jogo:**
   Abra seu navegador e vá para `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## 🏗️ Arquitetura do Projeto

```
src/
├── components/           # Componentes 3D do jogo
│   ├── Camera.js        # Configuração da câmera
│   ├── Car.js           # Modelo do carro
│   ├── DirectionalLight.js # Iluminação direcional
│   ├── Grass.js         # Terreno de grama
│   ├── Map.js           # Geração do mapa
│   ├── Player.js        # Modelo do jogador
│   ├── Renderer.js      # Configuração do renderizador
│   ├── Road.js          # Modelo da estrada
│   ├── Tree.js          # Modelo das árvores
│   ├── Truck.js         # Modelo do caminhão
│   └── Wheel.js         # Modelo das rodas
├── utilities/           # Funções utilitárias
│   ├── calculateFinalPosition.js
│   ├── endsUpValidPosition.js
│   └── generateRows.js
├── animatePlayer.js     # Animação do jogador
├── animateVehicles.js   # Animação dos veículos
├── audioSystem.js       # Sistema de áudio
├── collectUserInput.js  # Captura de entrada do usuário
├── constants.js         # Constantes do jogo
├── hitTest.js          # Detecção de colisões
├── livesSystem.js      # Sistema de vidas
├── main.js             # Arquivo principal
├── particleSystem.js   # Sistema de partículas
├── scoreSystem.js      # Sistema de pontuação
└── style.css           # Estilos CSS
```

## 🔧 Tecnologias Utilizadas

- **[Three.js](https://threejs.org/)** - Biblioteca para gráficos 3D
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **JavaScript ES6+** - Linguagem de programação
- **HTML5 Canvas** - Renderização
- **CSS3** - Estilização da UI

## 🎯 Funcionalidades Principais

### Sistema de Jogo

- **Movimento do Jogador**: Sistema de fila de movimentos para animações suaves
- **Geração Procedural**: Mapa gerado dinamicamente conforme o jogador avança
- **Detecção de Colisão**: Sistema preciso de hit testing
- **Física Simples**: Movimentação baseada em grid

### Sistemas de Feedback

- **Pontuação**: 
  - +10 pontos por linha avançada
  - Bônus por sequências sem colisão
  - Melhor score persistente

- **Vidas**: 
  - 3 vidas iniciais
  - Perde 1 vida por colisão
  - Regenera vida a cada 50 pontos

- **Efeitos Visuais**:
  - Partículas de colisão
  - Feedback visual de pontuação
  - Animações suaves

### Audio

- Música de fundo ambient
- Efeitos sonoros para:
  - Início do jogo
  - Colisões
  - Pontuação
  - Game over

## 🔄 Game Loop

1. **Inicialização**: Setup da cena, jogador e mapa
2. **Input**: Captura comandos do usuário
3. **Update**: 
   - Animação do jogador
   - Movimento dos veículos
   - Detecção de colisões
   - Atualização de sistemas
4. **Render**: Renderização da cena 3D
5. **Repeat**: Loop contínuo a ~60 FPS

## 🎨 Design e Arte

- **Estilo**: Low-poly, colorido e minimalista
- **Paleta**: Cores vibrantes inspiradas no Crossy Road original
- **Modelos**: Geometrias simples com flat shading
- **UI**: Interface limpa e responsiva

## 🐛 Resolução de Problemas

### Problemas Comuns

**O jogo não carrega:**
- Verifique se o Node.js está instalado
- Execute `npm install` para instalar dependências
- Verifique se a porta 5173 está disponível

**Performance baixa:**
- Feche outras abas do navegador
- Verifique se o hardware suporta WebGL
- Reduza a qualidade gráfica se necessário

**Sem áudio:**
- Clique em qualquer lugar da tela para ativar o contexto de áudio
- Verifique se o botão mute não está ativo
- Verifique as configurações de áudio do navegador

