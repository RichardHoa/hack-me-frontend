# Hack Me Frontend

This is the frontend for the Hack Me project. For this I'm using Svelte as a way to experiment with new technology, both the frontend and the backend is packaged as an image container and fully deploydable to the cloud

Warning: I use my old laptop as a machine to host this project, it's in southeast asia so if you are coming from another continent the speed of the website maybe impact

## Getting Started

### Prerequisites

You need to have [Node.js](httpss://nodejs.org/) installed. This project uses [pnpm](httpss://pnpm.io/) as the primary package manager. If you do not have pnpm, you can use npm, which comes with Node.js.

### Installation

1.  Clone the repo
    ```bash
    git clone https://github.com/RichardHoa/hack-me-frontend.git
    ```
2.  Install NPM packages.

    Using pnpm (recommended):

    ```bash
    pnpm install
    ```

    Or, if you are using npm:

    ```bash
    npm install
    ```

3.  Run the development server:

    Using pnpm:

    ```bash
    pnpm dev
    ```

    Or if you are using npm

    ```bash
    npm run dev
    ```

## Deployment

This project includes a `Dockerfile` for production deployment. While you can use it for local deployment, it is not necessary.

## Full local development

For a full local development experience, you will need to run the backend server as well. You can find the backend repository and instructions here: [backend repo](https://github.com/RichardHoa/hack-me)

## TODO list

[ ] add time to be GMT time rather than just time
