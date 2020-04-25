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
As a consistent R user of about a year now, I mainly started to use it as another tool besides STATA and SAS. I had never really thought of the prospect of using a software I'd be using for data analysis to make a whole website! Although `blogdown` is quite different from my usual R use, it's helped me become acquainted with the versatility of an open source language and all the ways that can enhance the regular data stuff. 


The cool thing about `blogdown` vs Jekyll which I tried before (and didn't get very far since it was too huge of a learning curve for me at the time) is that everything can be done within the RStudio IDE: you can write and edit your site files, preview your page within the viewer and push your changes to Github with the version control addin, which then links with [Netlify](https://www.netlify.com/) to deploy the website. It takes very few steps to have a website going without too much fancy web development knowledge. I did end up learning quite a lot of HTML, CSS and a bit of JavaScript along the way because I customized my page and theme quite a lot ([not really reccomended by the blogdown book](https://bookdown.org/yihui/blogdown/other-themes.html)-whoops), but I found it pretty interesting and enjoyable. 


I made this website using Hugo via the blogdown package in R. Hugo is one of many static website generators that provides a simpler alternative to customary dynamic websites, which is especially useful for personal pages and blogs. You can read more about why static websites may offer some utility over dynamic ones here.
Choosing a Static Website Generator
Even though I have been using RStudio IDE regularly, I didn’t initially resort to the blogdown package but decided to test Jekyll out, which is the generator for pages that use the .github.io domain. There was really no preference for a particular generator for me since I was new to the process, but Jekyll seemed popular (this is likely because it came out earlier than most other static website generators) and has a compelling showcase. Using Jekyll requires a Ruby development environment and subsequent bundler gems, an editor and git. In retrospect, I’d say the best route in choosing a generator as a beginner is to pick one that uses an environment you’re familiar with. Creating a static generated website is different than the statistical programming R is typically used for, so to work through the site components along with some front-end elements is already a bit of a learning curve that can get even more confusing in an entirely new environment, as it was in my case.
I started fresh with blogdown. The great thing about using blogdown as an already R user is that you don’t need to go through the typical Hugo installation process of manually installing Hugo and a package manager to get started. All you need to do is to install blogdown from CRAN like you would for any other package using the install.packages("blogdown") command and then install Hugo using the install_hugo() function. You can read more about the installation process from this chapter in the Blogdown book.
While creating this site, I also came across resources for GatsbyJS, which is another popular static website generator. Most of my experience creating a website is limited to Hugo, so if you are interested in knowing more about the specifications of these generators and how they compare, you can read here to learn more.
References
The Blogdown Book, created by the developers of the package, is a thorough and easy to follow reference with helpful guidance on creating a personal website. Hugo’s documentation is also good to refer to, especially if you want to further customize your page beyond your theme’s default. I will be referring to these two resources often in the sections detailing the site build.
Prerequisites
The following are the basic components needed to create and deploy a static website:
Git installed on your machine and a git repository host like GitHub, GitLab or Bitbucket.
R and RStudio if you plan to use blogdown or a source code editor if you plan to make your website outside of R. Note: If you plan to develop your website outside of R, then you need to install Hugo (alternatively, if you’re interested in using Jekyll, you can read the documentation here)
A Hugo theme. You can create a new theme if you’re using Hugo outside of blogdown, but to my knowledge I don’t think you create a site and theme together from scratch with blogdown.
A Netlify account. Netlify deploys your website using your Github/GitLab/Bitbucket repository.
You can get an idea of the workflow from this chapter of blogdown.
Building The Site
Set Up a Git Repository
There are two ways to get started with your project: 
Either you can create a new Github repository first. Initialize the repository with a README (you can just write something short in it like “My Website”). Once you’ve created the repository, go to RStudio and select File New Project Version Control Git. You will then be prompted to put the name of the repository. 
Alternative, you can create a new directory in R by selecting File New Project New Directory New Project and check the “Create a git repository” box 
To read more about using R and version control, the following resources are helpful: 
Using Version Control with R Studio 
Happy Git and GitHub for the useR 
Git’s Reference Manual 

Installing the blogdown package
As mentioned earlier in the post, the blogdown package is available in CRAN and can be installed in the RStudio console using install.packages("blogdown"). The blogdown::install_hugo() function then installs Hugo.
Selecting a theme
I picked the Hugo Imperfect Slim theme for this page because it has blog appearance that I was going for. The Blogdown book offers some guidance on picking a theme, emphasizing minimal is better. Hugo Imperfect Slim is honestly a bit clunky in that regard—the template has probably more going on than it needs to and there were some challenges with the CSS defaults to change the appearance of the theme. A spent a good amount of time customizing, which is probably not the most reccomended route to build a site, but I actually really learned to enjoy it and developed a good understanding of HTML, CSS and Javascript in the process.
Once you figure out what theme you want to use, click on the “Homepage” button of the Hugo theme page. It should take you to the Github repository where you will see the name of the repo on the upper left corner. You will need this name when creating a new site with your theme using the new_site() function. The command I used to create my site was
blogdown::new_site(theme = 'pacollins/hugo-future-imperfect-slim')
Understanding The Pages