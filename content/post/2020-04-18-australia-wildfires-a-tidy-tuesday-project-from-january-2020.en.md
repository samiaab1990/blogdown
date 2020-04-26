---
title: 'Visualizing Climate Data: A Tidy Tuesday Project from January 2020 using data from the Australia Wildfires-Part 1'
author: ''
date: '2020-04-18'
slug: australia-wildfires-a-tidy-tuesday-project-from-january-2020
categories:
  - r
  - data viz
tags:
  - TidyTuesday
  - ggplot
  - sp
  - sf
  - raster
description: ''
images:
  - ''
linktitle: ''
---

It's been a while since I've posted on this blog or have worked on a Tidy Tuesday project, so I thought I'd revisit and post the project I did in January for [R4DataScience](https://github.com/rfordatascience) to visualize climate data during the Australia wildfires earlier this year.

<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

<img src="/img/post/CopyOfDec2019avg.png"
     alt="December 2019 Temp Avg"
     width="80%"
     height="80%"
     class="center"/>

<img src="/img/post/CopyOfRainfallavg.png"
alt="December 2019 Rainfall Avg"
width="80%"
height="80%"
class="center"/>

These heatmap visualizations were inspired by Nick Tierny's [tutorial on Github](https://github.com/njtierney/ozviridis) transform Australia's Bureau of Meteorology's heatmap data into `viridis` themed maps and plots.

Additionally, the [Australia Wildfires TidyTuesday Github Repo](https://github.com/rfordatascience/tidytuesday/blob/master/data/2020/2020-01-07/readme.md) provided climate data for rainfall and temperature, which I used to make descriptive facet wrap plots for averages in six Australian cities. I will explain that analysis later in part 2. 


# Using `ggplot` To Create Your Own Heatmaps 

As mentioned previously, [Nick Tierny's tutorial](https://github.com/njtierney/ozviridis) did a great job of explaining how to recreate [Australia's Bureau of Meteorology's climate maps](http://www.bom.gov.au/jsp/awap/temp/index.jsp?colour=colour&time=latest&step=0&map=maxave&period=month&area=nat). BOM provides files by climate attribute (ie: temperature, rainfall) for daily, weekly or monthly averages in a .grid format that can be converted to an object of `SpatialPixelsDataFrame` class using the `sp` package in R and subsequently plotted using `ggplot` (you can use the base R `plot` function as well as demonstrated in the tutorial). *PC users-the .grid file you need will actually download as a .gridZ, which is a UNIX compressed format that will need to be extracted using [Winzip](https://www.winzip.com/win/en/) or [PeaZip](https://www.peazip.org/)* 

<img src="/img/post/bom_map.gif"
alt="BOM temperature map"
class="center"/>

<img src="/img/post/bom_rain.gif"
alt="BOM temperature map"
class="center"/>

The first thing needed to recreate the map is a shapefile of Australia, preferably with territorial boundaries. I was able to download it from the [Australian Government website](http://data.daff.gov.au/anrdl/metadata_files/pa_nsaasr9nnd_02211a04.xml) but [Natural Earth](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/) is also a popular resource for retrieving map data. The `readOGR()` function from the `rgdal` package reads in .shp files. I then used the `fortify()` function from `ggplot2` that converts the shapefile into a dataframe compatible with ggplot. *Note that `fortify` may be deprecated in the future and the `tidy()` function from the `broom` package is preferred. `Fortify()` works for me so I used it in this example-you can read [the documentation](https://ggplot2.tidyverse.org/reference/fortify.map.html) to learn more about the function.*

```
library(rgdal)
library(ggplot2)
library(tidyverse)

# Converting the shapefile saved in the working directory into an r object 

australia<-readOGR("aust_cd66states.shp") 

# Specifying the states and territories `STE` in the shapefile which will define the boundaries 

australia_fortified<-australia %>% fortify(australia, region='STE')
```

Next, I used the `raster` package to read in the .grid files for the [temperature averages for December 2019](http://www.bom.gov.au/web03/ncc/www/awap/temperature/maxave/month/grid/0.05/history/nat/2019120120191231.grid.Z). The sequence is essentially as follows: 1. Save the data into raster objects 2. Convert into a `SpatialPixelsDataFrame` using the `sp` package 3. convert the `sp` object into a data frame using the `as.data.frame()` function in base. This object can then be used in `geom_polygon()` in `ggplot`.

```
library(raster)
library(sp)
# Converting the .grid file saved in the working directory into an r object

# Mean Maximum Temperature Averages for December 2019
aus_climate<-raster('2019120120191231 (1).grid') 

climate_spdf <- as(aus_climate, "SpatialPixelsDataFrame")
climate_df <- as.data.frame(climate_spdf)
```
By this point, the .grid files can be overlayed on the Australia shapefile to create [this map in Nick's example](https://github.com/njtierney/ozviridis#bob-rudiss-answer-on-so). I was interested in having the grid data only restricted to the boundaries within the Australia shapefile. This is basically subsetting the grid data using the Australia shapefile as a reference.

This [example here](https://gis.stackexchange.com/questions/63793/how-to-overlay-a-polygon-over-spatialpointsdataframe-and-preserving-the-spdf-dat) and the [sp package documentation](https://cran.r-project.org/web/packages/sp/vignettes/over.pdf)(*I found this vignette after doing this project-Stack Overflow gave me the original answer*) show how you can use the `over()` function in the `sp` package to subset points that only fall within the polygon. Essentially, placing the spatial data object and shapefile in the function returns either a number or NA-the latter which denotes points in the data do not fall into the polygon. Restricting to values that are not NA will keep only the points that fall inside the polygon

```
# Here, I'm creating an object called australia_climate_interior, which will only select points from the grid data that fall in the australia shapefile
australia_climate_interior<-climate_spdf[!is.na(over(climate_spdf, as(australia, "SpatialPolygons"))), ]

#Converting this to data frame the way I did previously so that it can be read into geom_polygon later on 
australia_climate_interior<-as.data.frame(australia_climate_interior)

```
The rainfall and temperature .csv files will be used later to create the facet wrap plots, but they have the lat/long points of the cities, which I thought would be nice to have on the map to compliment the graphs. 

```
rainfall <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-07/rainfall.csv')

temperature <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-07/temperature.csv')

australia_cities<-rainfall %>% dplyr::select(city_name,long,lat)
australia_cities<-unique(australia_cities)

# Removing a duplicate name that some reason was included despite the unique() function

australia_cities<-australia_cities[-4,]

```
Lastly, I wanted to clean some things up and mutate the temperature variable to show both Celcius and Fahrenheit

```
#In this part, I am doing some renaming of the variable names (the temperature values in degrees Celcius are named under a lengthy variable reflecting the filename

australia_climate_interior<-australia_climate_interior %>% rename(temp=X2019120120191231_.1.)

#Creating a Fahrenheit Variable
australia_climate_interior<-australia_climate_interior %>% mutate(temp.f=((temp*9/5)+32))

```

Since I want to show both Celcius and Farhenheit on the map, I created the breaks and labels manually before plotting. I used Farhenheit as my "primary" measure (I'm based in the US <span style='font-size:20px;'>&#128541;</span> and admittedly am not well versed in reading Celcius) and put the corresponding Celcius value below. To do this, I found the minimum and maximum temperature values in Farhenheit and used 10 degrees as scale increments. Then I created the same object in Celcius using the Farhenheit to Celcius formula. I created a labels object based off these break values so the scale shows the Farhenheit values and corresponding Celcius values below.

```
min(australia_climate_interior$temp.f)
max(australia_climate_interior$temp.f)

breaks<-seq(50,120, by=10)
breaks.c<-round(((breaks-32)*5/9),0)
labels<-paste0(breaks,sep="\n",breaks.c)
```

*After revisiting my code months later, I realized I would have rather saved the min/max temperature values as objects so that the ggplot code is flexible and adaptable to different data file inputs*

```
min<-round(min(australia_climate_interior$temp.f),0)
max<-round(max(australia_climate_interior$temp.f),0)

breaks<-seq(min,max, by=10)
breaks.c<-round(((breaks-32)*5/9),0)
labels<-paste0(breaks,sep="\n",breaks.c)
```

And now for the actual maps...
## Temperature Map

```{r}
library(ggdark)
library(showtext)
library(ggrepel)

#Windows function to use a different font than ggplot default

showtext.auto()
dec_avg<-ggplot()+

# The data essentially exists as tiny pixels which can be thought of as a tiny squares suitable for geom_tile. Here, I'm plotting the x and y coordinates and filling it in with the temperature in Farhenheit

  geom_tile(data = australia_climate_interior, 
            aes(x = x, 
                y = y, 
                fill = temp.f))+
# The Australia shapefile
  geom_polygon(data = australia_fortified, 
               aes(x = long, 
                   y = lat, 
                   group = group), 
               fill = NA, 
               color = "#3E3E3E", 
               size = 0.3) +
  # Add the city names as points on the map
  geom_point(data=australia_cities,aes(long,lat), color="#D8D0D0")+
  geom_text_repel(data=australia_cities,aes(long,lat,label=city_name), size=5, color="#D8D0D0")+
  
  # Using "plasma" from the viridis package for the color scheme of the map
  scale_fill_viridis_c(option = "plasma", breaks=breaks, labels=labels) +
  coord_equal() +
  
  # Using dark theme from `ggdark`
  dark_theme_gray()+
  
  # Labels
  labs(title="Australia Climate Map",
       subtitle="Daily Mean Maximum Temperatures December 2019",
       caption="Source: Australian Government Bureau of Meteorology")+
       
  # Theme Attributes
  theme(
        plot.title = element_text(family="Roboto", size=10,color="#D7D7D7", face="bold"),
        plot.subtitle=element_text(family="Roboto", size=5, color="#D7D7D7"),
        plot.background = element_rect(fill = "grey10"),
        legend.text=element_text(color="#B3B3B3", size=4, lineheight = .3),
        legend.title=element_text(color="#B3B3B3", size=4, vjust=.8),
        panel.background = element_blank(),
        panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        legend.background = element_blank(),
        axis.ticks = element_blank(),
        legend.key = element_blank(),
        axis.text=element_blank(),
        axis.title=element_blank(),
        legend.position = "bottom",
        legend.justification="right",
        plot.caption=element_text(hjust=0,size=3))+
  
  # Legend Attributes/Appearance

guides(fill=guide_colorbar(title="Temperature °F/°C",ticks=FALSE,       direction="horizontal", barwidth = 5,  barheight=.8,label.position="bottom", title.position = "top", title.vjust = -5, title.hjust=.5, label.vjust=1))

```
<img src="/img/post/CopyOfDec2019avg.png"
     alt="December 2019 Temp Avg"
     width="85%"
     height="85%"
     class="center"/>

## Rainfall map
For the rainfall map, I used a bit of a different process with the `raster` package to smooth the raster to a polygon so it doesn't give a grainy/pixelated look (a problem more so with rainfall data than temperature). *I was considering but ended up not using the `smoothr` package, which offers additional [options to smooth rasters to polygons](https://cran.r-project.org/web/packages/smoothr/vignettes/smoothr.html).*

The workflow starts the same: 1. Call in the .grid file using the `raster()` function 2. Convert to a spatial pixels data frame 3. Subset to points that fall within the Australia shapefile. In the last part, however, I'm converting the spdf object back into a raster

```
# Convert the rainfall.grid file saved in the working directory to a raster object
rainfall_grid<-raster('rainfall.grid')

# Convert into a SpatialPixelsDataFrame
rainfall_spdf<-as(rainfall_grid, "SpatialPixelsDataFrame")

# Subset to only points that fall within the Australia shapefile
rainfall_interior_spdf<-rainfall_spdf[!is.na(over(rainfall_spdf, as(australia,"SpatialPolygons"))),]

# Convert the subsetted object back to a raster
rainfall_interior_raster<-raster(rainfall_interior_spdf)
```

Unlike the temperature map, which uses the continuous value of each grid cell, I'm converting the rainfall in mm to categorical levels that will be more suitable to visualize as polygons. This is essentially recreating the Bureau of Meteorology's map, except with a different color scheme. I used their breakpoints as levels for this map as well.

```
# Create levels in the raster using the BOM's rainfall map breakpoints
rainfall_interior_raster$level<-cut(rainfall_interior_raster$rainfall, c(-Inf,1,5,10,25,50,100,200,300,400,Inf))
```
At this point, I'm going to use the same raster to create two objects: one will be an `sf` object to fill the colors within the data frame object outlined using `geom_polygon()`

```
library(sf)

# Convert the polygon as an sf object
rainfall_interior_raster_poly<-rasterToPolygons(rainfall_interior_raster) %>% st_as_sf()

# Convert the polygon to a data frame to be used in geom_polygon()

rainfall_interior_raster_df<-rasterToPolygons(rainfall_interior_raster) 

rainfall_interior_raster_df<-SpatialPolygonsDataFrame(rainfall_interior_raster_df,rainfall_interior_raster_df@data) 

rainfall_interior_raster_df<-tidy(rainfall_interior_raster_df, region="level")
```

and now, the map!

```

# Defaults for output .png file
png("Rainfallavg.png", units="in", width=10, height=9, res=300)

# Use fonts different than ggplot default
showtext.auto()

rain_avg_plot<-ggplot()+

# The sf object used to fill the colors using the viridis palette
  geom_sf(data=rainfall_interior_raster_poly, aes(fill=level), color=NA)+

# the df object will be used to create a light grey outline of the polygon object
  geom_polygon(data=rainfall_interior_raster_df, aes(long,lat,group=group), fill=NA, color="#3E3E3E", size=.3)+

# another geom_polygon for the Australia shapefile 
  geom_polygon(data = australia_fortified, 
               aes(x = long, 
                   y = lat, 
                   group = group), 
               fill = NA, 
               color = "#3E3E3E", 
               size = 0.3) +
# Add in the major cities as points similar to the temperature map
  geom_point(data=australia_cities,aes(long,lat), color="#D8D0D0")+
  geom_text_repel(data=australia_cities,aes(long,lat,label=city_name), size=12, color="#D8D0D0")+

# Use the viridis scale option to manually set the breakpoints
  scale_fill_viridis_c(option="viridis", breaks=c(1,2,3,4,5,6,7,8,9,10), label=c("0","1","5","10","25","50","100","200","300","400+"))+

# Use coord_sf() to compliment the sf object used for the map
  coord_sf() +
# Set theme to dark_theme_gray()
  dark_theme_gray()+
# Map labelling
  labs(title="Australia Climate Map",
       subtitle="Rainfall Totals December 2019",
       caption="Source: Australian Government Bureau of Meteorology")+
# Theme attributes
  theme(plot.title = element_text(family="Roboto", size=100,color="#D7D7D7", face="bold"),
        plot.subtitle=element_text(family="Roboto", size=50, color="#D7D7D7"),
        plot.background = element_rect(fill = "grey10"),
        legend.text=element_text(color="#B3B3B3", size=40, lineheight = .3),
        legend.title=element_text(color="#B3B3B3", size=40, vjust=.8),
        panel.background = element_blank(),
        panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        legend.background = element_blank(),
        axis.ticks = element_blank(),
        legend.key = element_blank(),
        axis.text=element_blank(),
        axis.title=element_blank(),
        legend.position = "bottom",
        legend.justification="right",
        plot.caption=element_text(hjust=0,size=36))+
# Legend attributes  
guides(fill=guide_colorbar(title="Rainfall(mm)",ticks=FALSE, direction="horizontal", barwidth = 20,  barheight=.8,label.position="bottom", title.position = "top", title.vjust = -5, title.hjust=.5, label.vjust=5))
rain_avg_plot
dev.off()
```
<img src="/img/post/CopyOfRainfallavg.png"
     alt="December 2019 Rainfall Avg"
     width="85%"
     height="85%"
     class="center"/>



