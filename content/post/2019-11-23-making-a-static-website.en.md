---
title: 'Making A Website With RStudio: The Blogdown Package'
author: ''
date: '2019-11-23'
slug: making-a-static-website-using-blogdown
categories:
  - r
  - web development
tags:
  - blogdown
  - javascript
  - html
  - css
  - jekyll
description: ''
linktitle: ''
type: post
draft: true
---

Welcome to the first post of my `blogdown` blog! Although I started writing this post in November 2019, it's still been in the drafts as of currently April 2020 <span style='font-size:20px;'>&#128517;</span>. I figured the debut post would be best dedicated to sharing my personal experience of using this package as an R user with little to no background in web development.

Before starting a page, it's helpful to have some idea of the difference between static websites vs. dynamic ones. Most websites people are probably best acquainted with are dynamic, which uses scripting language in the backend to process inputs provided by a user on the front end. Static websites, like the ones `blogdown` creates, don't have those behind the scenes processes: the site is a product of fixed content on pages. They provide a simpler and minimal option for blogs or personal websites, which are primarily meant for documenting rather than having users interact with servers.

The static website workflow is basically as follows: 1. organizing the content of your site in a series of static files 2. using a static website generator to render these pages into a website 3. linking this to a platform that will deploy the website. `Blogdown` uses [Hugo](https://gohugo.io/) as its site generator whereas other platforms, like [Github pages](https://pages.github.com/), use [Jekyll](https://jekyllrb.com/), which is amongst the oldest and most commonly used generators. 

The utility of markdown in RStudio makes it an ideal environment to create static site pages. The `blogdown` package simplifies the process further by allowing the site rendering to be done within the IDE as well: once you write and edit your site files, you can preview your page within the viewer and push your changes to Github with the version control addin, which then links with [Netlify](https://www.netlify.com/) to deploy the website. Outside of `blogdown`, a typical workflow would involve installing requirements from the static generators, using a markdown editor to create the files and using command line to preview and push changes, which can be an overwhelming learning curve for somebody new to these tools. 

It takes very few steps to have a website going (according to the [blogdown book](https://bookdown.org/yihui/blogdown/other-themes.html)-it can be done in 10 minutes) without too much fancy web development knowledge. I did end up learning quite a lot of HTML and CSS and a bit of JavaScript along the way to make my page because I customized my theme a fair amount (not really reccomended by the blogdown book-whoops), but it was a personal preference and not something required to have a functional page. 

If you're interested creating a website of your own using `blogdown`, here are some concepts to know and fun things I've discovered in making this page.

# Getting Started
The first step in getting started with a `blogdown` page is to have the [blogdown book](https://bookdown.org/yihui/blogdown/) handy.

The next steps involve creating a new R project, installing the `blogdown` package and picking a [Hugo theme](https://themes.gohugo.io/) for your page. I used [Hugo Future Imperfect Slim](https://themes.gohugo.io/hugo-future-imperfect-slim/), which is specified by repository name in the `theme=` argument of the `new_site()` function that creates the blog. To find the theme's repo on Hugo, navigate to the Homepage button:

<img src="/img/post/blogdown_1.png" width="70%" height="70%">

<img src="/img/post/blogdown_2.png" width="70%" height="70%">


The code I typed into the console was as follows:
```
# Install and call in the packages
install.packages("blogdown")
library(blogdown)

# Use the new_site() function to start a new site with theme = to the theme repository 

blogdown::new_site(theme = 'pacollins/hugo-future-imperfect-slim')
```
Keep in mind you will need to link your local `blogdown` project to a repository on your Github. Either you can create the repository before creating the RProject and start a new RProject from version control. Or you can link the repository later in the project (for more on version control in R, you can read this [article on the RStudio support page](https://support.rstudio.com/hc/en-us/articles/200532077-Version-Control-with-Git-and-SVN)). 

# The Anatomy of a Blogdown Directory
After running `new_site()`, your project directory will have some version of the following files:

<img src="/img/post/project_directory.png" width="30%" height="30%">

Every theme may have variable directories, so it's best to refer to the theme's documentation. Most will have either a .toml, .yaml or .json config file, otherwise known as ["Front Matter"](https://gohugo.io/content-management/front-matter/), which determines the main features of your site. 

I like to think of front matter as the *upfront* changes or kind of functionally what would be the settings page if you were using a dynamic blogging website like Wordpress. The inputs in the config file provide values for variables intrinsic to the theme's template. Here's an [example](https://github.com/pacollins/hugo-future-imperfect-slim/blob/master/exampleSite/config.toml) of a config.toml using the Future Imperfect Slim theme.

# Previewing-Building-Deploying
# Cool Add-ins for your page


