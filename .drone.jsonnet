[
    {
        kind: "pipeline",
        name: "Build Packages and Release",
        steps: [
            {
                name: "build and release",
                image: "node:10",
                commands: [
                    "npm install",
                    "npm publish"
                ],
                environment: {
                    NODE_AUTH_TOKEN: "$$NPM_TOKEN"
                },
            },
        ],
    }
]