# Nikahub: Research Management Software
A platform designed to handle complex knowledge management needs, particularly in research-intensive environments (e.g., academic and industry labs). This solution helps teams organize research data, insights, and documentation seamlessly over extended timelines and multiple collaborators.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Why This Matters](#why-this-matters)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
This project tackles the **chaotic processes** of capturing and maintaining knowledge when working on complex, long-term research. By combining AI assistance with thorough documentation workflows, it helps researchers:
- **Absorb** intricate topics more effectively.
- **Reuse** and **build upon** existing knowledge from past projects or other collaborators.
- Minimize **redundant work** and confusion during turnovers or team expansions.

---

## Key Features
1. **Deep Context Management**: Focuses on capturing reasoning, methodology, and data—not just final outcomes.
2. **High Scalability**: Extensible to different research domains and can integrate with existing data sources.
3. **Collaboration-Ready** (Future Direction): Multiple contributors can collaborate on research, effortlessly merging results, insights, and references.
4. **AI-Assisted Workflows** (Future Direction): Proposed features to refine documentation, summarize new findings, and suggest relevant references.

---

## Why This Matters
- **High Turnover**: Labs and teams often rotate students or staff, leading to lost knowledge.
- **Cross-Disciplinary Complexity**: Research continues to expand into multiple fields; a single hub for advanced insights is crucial.
- **Time & Resource Savings**: Effective documentation and retrieval cut down on repeated experiments or analyses.

---



## Repository Structure

```
.
├── backend
│   ├── build-backend.sh
│   ├── canvas
│   │   ├── e2e
│   │   │   ├── app.e2e-spec.ts
│   │   │   ├── canvas.e2e-spec.ts
│   │   │   ├── card.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   └── setup.ts
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   ├── firstentity
│   │   │   │   ├── canvas.controller.spec.ts
│   │   │   │   ├── canvas.controller.ts
│   │   │   │   ├── canvas.service.spec.ts
│   │   │   │   ├── canvas.service.ts
│   │   │   │   ├── card.controller.spec.ts
│   │   │   │   ├── card.controller.ts
│   │   │   │   ├── card.service.spec.ts
│   │   │   │   ├── card.service.ts
│   │   │   │   ├── dto
│   │   │   │   │   ├── create-canvas.dto.ts
│   │   │   │   │   ├── create-card.dto.ts
│   │   │   │   │   ├── create-firstentity.dto.ts
│   │   │   │   │   ├── update-canvas.dto.ts
│   │   │   │   │   ├── update-card.dto.ts
│   │   │   │   │   └── update-firstentity.dto.ts
│   │   │   │   ├── entities
│   │   │   │   │   ├── canvas.entity.ts
│   │   │   │   │   ├── card.entity.ts
│   │   │   │   │   └── firstentity.entity.ts
│   │   │   │   ├── firstentity.controller.spec.ts
│   │   │   │   ├── firstentity.controller.ts
│   │   │   │   ├── firstentity.module.ts
│   │   │   │   ├── firstentity.service.spec.ts
│   │   │   │   └── firstentity.service.ts
│   │   │   ├── main.ts
│   │   │   ├── swagger.ts
│   │   │   └── update-cards.ts
│   │   └── test
│   │       ├── integration
│   │       │   └── firstentity
│   │       │       ├── canvas.integration.spec.ts
│   │       │       └── card.integration.spec.ts
│   │       └── setup.ts
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── jest.integration.config.js
│   ├── logging_configuration
│   ├── nest-cli.json
│   ├── openapi.yaml
│   ├── package.json
│   ├── package-lock.json
│   ├── scripts
│   │   └── wait-for-it.sh
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── build.sh
├── docker-compose.yml
├── frontend
│   ├── babel.config.js
│   ├── build-frontend.sh
│   ├── cypress
│   │   ├── cypress.config.js
│   │   └── e2e
│   │       ├── support
│   │       │   ├── commands.js
│   │       │   └── index.js
│   │       └── tests
│   │           ├── app.e2e.spec.js
│   │           ├── canvas.e2e.spec.js
│   │           └── card.e2e.spec.js
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   ├── scripts
│   │   └── wait-for-it.sh
│   ├── src
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── components
│   │   │   ├── Canvas
│   │   │   │   ├── Canvas.jsx
│   │   │   │   └── Canvas.test.js
│   │   │   ├── Card
│   │   │   │   ├── SingleCard.jsx
│   │   │   │   └── SingleCard.test.js
│   │   │   └── ErrorBoundary.jsx
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── models
│   │   │   ├── canvasModel.js
│   │   │   └── cardModel.js
│   │   ├── reportWebVitals.js
│   │   ├── services
│   │   │   ├── canvasService.js
│   │   │   ├── canvasService.test.js
│   │   │   ├── cardService.js
│   │   │   ├── cardService.test.js
│   │   │   └── __mocks__
│   │   │       ├── canvasService.js
│   │   │       └── cardService.js
│   │   ├── setupTests.js
│   │   └── __tests__
│   │       ├── components
│   │       │   ├── Canvas.integration.test.js
│   │       │   └── SingleCard.integration.test.js
│   │       ├── env.test.js
│   │       ├── models
│   │       │   ├── canvasModel.integration.test.js
│   │       │   └── cardModel.integration.test.js
│   │       └── services
│   │           ├── canvasService.integration.test.js
│   │           ├── cardService.integration.test.js
│   │           └── simpleMock.test.js
│   ├── ssm-policy.json
│   ├── tailwind.config.js
│   └── webpack.config.js
├── LICENSE
└── README.md
```

---

### Key Folders

- `backend`: Contains the NestJS-based server-side code, API definitions, and integration tests.  
- `frontend`: Contains the React-based front-end code, with tests (Jest/Cypress) and build scripts.  
- `docker-compose.yml`: Used to orchestrate both backend and frontend services for development or production.  
- `scripts`: Various shell scripts for build, CI/CD, and environment provisioning.

---

## Getting Started

### Prerequisites

- **Node.js** (latest LTS)
- **Docker** & **Docker Compose** (for container-based setup, optional)

### Installation

1. **Clone** the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. **Install dependencies** for each service:

```bash
# In the backend folder
cd backend
npm install

# In the frontend folder
cd ../frontend
npm install
```

--- 

### Running the Project
1. **Using Docker Compose** (recommended):
   ```bash
   docker-compose up --build
   ```
   This will spin up both the frontend and backend containers.

2. **Local Development (Node.js)**:
   - **Backend**:  
     ```bash
     cd backend
     npm run start:dev
     ```
   - **Frontend**:  
     ```bash
     cd frontend
     npm start
     ```
   By default, the frontend is on `http://localhost:3000` and the backend on `http://localhost:3001`.

---

## Contributing
1. **Fork** the repo.
2. Create a **feature branch** (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a **Pull Request**.

Please open an issue to suggest improvements or report bugs.

---

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as permitted.

---

**Thank you for your interest in this project!**  
For questions or collaboration, please reach out via [GitHub Issues](../../issues) or contact me directly.
