# react-tailwind-template

This is a template project for building React applications with Tailwind CSS. It includes a pre-configured development environment using Vite and TypeScript, as well as several useful scripts for linting and spell checking your code.

## Getting Started

To get started with this template, simply clone the repository and install the dependencies using npm:

```bash
git clone https://github.com/gandresto/react-tailwind-template.git
cd react-tailwind-template
yarn install
```

You can then run the development server using the following command:

```bash
yarn dev
```

This will start a development server at http://localhost:3000/ where you can see your React application running.

## Scripts

This project includes several scripts that you can use to lint, spell check, build, and preview your application.

- `prepare`: Installs Husky, a Git hook manager, to enable Git hooks for the project.
- `dev`: Starts a development server at http://localhost:3000/.
- `build`: Builds your application for production using TypeScript and Vite.
- `preview`: Serves the production build of your application at http://localhost:5000/.
- `lint`: Lints your TypeScript and React code using ESLint and the AirBnb style guide.
- `lint:fix`: Lints your code and automatically fixes any issues that it finds.
- `spell`: Spell checks your code using CSpell.
- `commit`: Commits your changes using Commitizen and the conventional commit format.

## Dependencies

This project includes the following dependencies:

- `classnames`: A utility for joining classNames together.
- `react`: A JavaScript library for building user interfaces.
- `react-dom`: The entry point to the DOM and server renderers for React.

## License

This project is licensed under the Apache License Version 2.0.

The Apache License is a permissive free software license that allows users to use, modify, and distribute software, as well as to distribute modified versions of the software. The license also includes a patent license that protects users from patent infringement claims that may arise from using the software. For more information, please see http://www.apache.org/licenses/.
