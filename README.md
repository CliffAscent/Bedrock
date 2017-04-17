
# Bedrock

**Development of this project has discontinued in favor of other open source projects, but remains on GitHub for demonstration purposes.**

Bedrock is the unification of advanced front-end development tools forming a comprehensive and flexible front-end framework. The goal is to provide a thorough and light-weight starting point for any front-end project that eliminates the need for repetitive tasks, while being design-agnostic, and helps maintain best-practices.

The framework can either be updated independent of your application or be forked and modified to fit any work-flow. Bedrock does require advanced knowledge and techniques to be fully utilized, as to not sacrifice it's goal, but is still designed to be as user-friendly as possible.

The current version of Bedrock is **0.8.0** which is meant for *beta testing*.


## Requirements

Grunt is a JavaScript task runner for [node.js](https://nodejs.org/) and serves as the foundation for the framework. Check out the Grunt [getting started](http://gruntjs.com/getting-started) guide to learn how to setup and use Grunt.

Knowledge of the command line and the installation of packages through [npm](https://www.npmjs.com/) is required to use Bedrock. To take full advantage of the framework you should have experience with CSS pre-processors, such as [SASS](http://sass-lang.com/) or [LESS](http://lesscss.org/), and the JavaScript module loader [RequireJS](http://requirejs.org/).


## Installation

Using `git clone https://github.com/CliffAscent/Bedrock.git .` from within your project directory is the suggested method of downloading the Bedrock files. You can also [manually download](https://github.com/CliffAscent/Bedrock/archive/master.zip) and unpack the files into your project directory.

Once the files are in place run `npm install` to download the necessary packages.

Finally run `grunt build` to finish the installation. The build task will download vendor scripts and compile assets into the web accessible directory.


## Overview

At it's core Bedrock is a [Grunt file](https://github.com/CliffAscent/Bedrock/blob/master/docs/grunt.md) that ties together common front-end development tools using a range of configurable settings and built-in tasks. The framework allows the developer to easily bring together their preferred tools and modules into a unified environment that can be customized for almost any work-flow.

### Settings

Bedrock offers a [wide range of settings](https://github.com/CliffAscent/Bedrock/blob/master/docs/settings.md) that can be configured during runtime or from within the `config` directory. Settings take the following priority;

1. grunt option, example: `grunt watch --env=live`
2. custom setting declared in `config/env/[env setting].json`
3. custom setting declared in `config/settings.json`
4. the default setting

### Tasks

A [host of tasks](https://github.com/CliffAscent/Bedrock/blob/master/docs/tasks.md) are provided to manage an efficient development work-flow. The most common tasks are used to build your project for deployment, watch files for changes and take the necessary actions, compile assets into their working directory, compress and copy files, etc. Custom tasks can also be integrated by adding a new file into the `tasks` directory following the `example.js` located inside.

### File Structure

The file structure can be customized as you see fit by adjusting the necessary settings so your assets can be located by the framework. By default the `www` directory is the only one intended to be web accessible and assets compile into the `www/assets` directory. By default the `vendor` directories are ignored in git and intended to have third party assets pulled into them during the build process.

### Boilerplate Code

Bedrock also contains boilerplate [CSS](https://github.com/CliffAscent/Bedrock/blob/master/docs/css.md) and [JavsScript](https://github.com/CliffAscent/Bedrock/blob/master/docs/javascript.md) to serve as a foundation for common patterns, modules, and functions that most web applications contain. This boilerplate code is most similar to Foundation and Bootstrap, and can be completely ignored or replaced as desired. The main difference between the Bedrock boilerplate code and others is an assumed level of developer knowledge, a focus on producing custom-crafted content over rapid prototyping, and a concerted effort to remain design-agnostic.

### Other Frameworks

Bedrock is compatible with almost any front-end Framework and provides [guides](https://github.com/CliffAscent/Bedrock/blob/master/docs/guides.md) for integrated Foundation and Bootstrap.


## Support

Bedrock versions are separated into three release groups: **major.minor.hot-fix**

Support requests and bug reports can be directed to the [GitHub issue tracker](https://github.com/CliffAscent/Bedrock/issues).

Code contributions are encouraged and can be done by cloning the repository, making your changes, and then submitting a **detailed** [pull request](https://github.com/CliffAscent/Bedrock/pulls).


## Documentation

+ [Settings](https://github.com/CliffAscent/Bedrock/blob/master/docs/settings.md)
+ [Grunt](https://github.com/CliffAscent/Bedrock/blob/master/docs/grunt.md)
+ [CSS](https://github.com/CliffAscent/Bedrock/blob/master/docs/css.md)
+ [JavaScript](https://github.com/CliffAscent/Bedrock/blob/master/docs/javascript.md)
+ [Guides](https://github.com/CliffAscent/Bedrock/blob/master/docs/guides.md)


## To Do

+ Finish the documentation.
+ Add SCSS variables for the min and max of breakpoint ranges.
