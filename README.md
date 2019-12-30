# Scouts-Elections-Server

This API allows any program to generate, join and update in real time any Scout elections and is mainly used to fuel the shared election functionality of my own election website : https://github.com/V-ed/Scouts-Elections.

The logic to host the server has been abstracted in my own server, allowing me to have control over my server without this repository interfering with the logic behind it : however, this repository feeds my server to implement the logic of how to handle routes and the logic of these routes.

A linter is configured to check every commit. This project therefore adheres to the ESLint conventions.

Few VSCode launch tasks were configured so that on my machine, I only need to start debugging and my whole server turns into a debug mode, where nodemon handles the hot reload and vscode can inspect the code.
This means that whenever the debug in vscode starts, my server turns into a debug mode, and when the debug stop, the server restarts in normal mode.

## Author

- Guillaume Marcoux ([V-ed](https://github.com/V-ed)) - Owner

See also the list of [contributors](https://github.com/V-ed/jrequester/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details
