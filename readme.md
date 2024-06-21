# Headwind
A runtime utility css library

## Installation
Add the following to the top of your HTML document.

```HTML
<script type="module">
    import { headwind } from "https://cdn.jsdelivr.net/gh/jjbenson85/headwind@main/dist/headwind.js";
    headwind();
</script>
```

## Getting Started

#### Property Value pairs
Each class name will create a new CSS rule, using the class name as the selector and the parsed value of the class name to create the css property and value.


```HTML
<div class="background-color[red]"></div>
```
 
 becomes

```css
.background-color\[red\]{
    background color: red;
}
```
*NB. Special characters such as `[` and `]` will be escaped with `\` in the CSS rule*


#### Compound values
To use a complex value made of multiple values, separate then with an `_`

```HTML
<div class="box-shadow[0_0_8px_-1px_blue]"><div>
```

becomes

```css
.box-shadow\[0_0_8px_-1px_blue\] {
	box-shadow: 0 0 8px -1px var(--hsla-blue-500-100);
}
```

#### Psuedo-selectors
To use psuedo-selectors like `:hover` just add them as a suffix.

```HTML
<div class="background-color[red]:hover"></div>
```

becomes

```css
.background-color\[red\]\:hover:is(:hover) {
    background color: red;
}
```

*NB. `:is()` is used so multiple psuedo-selectors can be applied*


```HTML
<div class="background-color[red]:hover:focus"></div>
```

becomes

```css
.background-color\[red\]\:hover\:focus:is(:hover, :focus) {
    background color: red;
}
```

#### Break Points
To get different behaviours at different screen widths, add an `@` with the breakpoint label after the value.

```HTML
<div class="background-color[red@sm]"></div>
```

becomes

```css
@media (min-width: 640px) {
 .bg\[red\@sm\] {
	background-color: var(--hsla-red-500-100);
}
```

The default breakpoints are

| label | min width (px) |
|-------|----------------|
| xs    | 0              |
| sm    | 640            |
| md    | 768            |
| lg    | 1024           |
| xl    | 1280           |


To add multiple values at different breakpoints, add more values with `@` labels

```HTML
<div class="background-color[red@xs][blue@md][green@xl]"></div>
```

becomes

```css
/* From 0px to 758px, element will be red */
@media (min-width: 0px) {
    .background-color\[red\@xs\]\[blue\@md\]\[green\@xl\] {
        background-color: var(--hsla-red-500-100);
    }
}

/* From 768px to 1280px, element will be blue */
@media (min-width: 768px) {
    .background-color\[red\@xs\]\[blue\@md\]\[green\@xl\] {
        background-color: var(--hsla-blue-500-100);
    }
}

/* From 1280px and over, the element will be green */
@media (min-width: 1280px) {
    .background-color\[red\@xs\]\[blue\@md\]\[green\@xl\] {
        background-color: var(--hsla-green-500-100);
    }
}
```


#### Unit Values
To help keep consitency with padding and margin sizes, some default sizes are provided. They are accessed by passing a number value without a unit.


```HTML
<div class="padding[4]"></div>
```

becomes

```css
:root {
    --unit-4: 1rem;
}

.p\[4\] {
	padding: var(--unit-4);
}
```

 By default, the unit values are the number * 0.25 rem and can take any positive or negative number


 #### Labeled Sizes
 Instead of using number units, labels such as `xs` for extra-small or `md` for medium can be passed.


```HTML
<div class="rounded[md]"></div>
```

becomes

```css
:root {
    --unit-4: 1rem;
}

.p\[4\] {
	padding: var(--unit-4);
}
```

| label     	| size                     	|
|-----------	|--------------------------	|
| xs        	| 0.25 rem                 	|
| sm        	| 0.5 rem                  	|
| md        	| 0.75 rem                 	|
| lg        	| 1 rem                    	|
| xl        	| 1.25                     	|
| \<number>xl 	| (4 + number ) * 0.25 rem 	|


#### Shorthand Values
For brevity, some often used properties can accessed using special shorthand names

```HTML
<div class="p[4]"></div>
```

becomes

```css
:root {
    --unit-4: 1rem;
}

.p\[4\] {
	padding: var(--unit-4);
}
```
#### Available Shorthand properties

| label 	| property                     	|
|-------	|------------------------------	|
| p     	| padding                     	|
| px    	| padding-left, padding-right 	|
| py    	| padding-top, padding-bottom 	|
| pl    	| padding-left                	|
| pr    	| padding-right               	|
| pt    	| padding-top                 	|
| pb    	| padding-bottom              	|
| m     	| margin                      	|
| mx    	| margin-left, margin-right   	|
| my    	| margin-top, margin-bottom   	|
| ml    	| margin-left                 	|
| mr    	| margin-right                	|
| mt    	| margin-top                  	|
| mb    	| margin-bottom               	|
| w     	| width                       	|
| min-w 	| min-width                   	|
| max-w 	| max-width                   	|
| h     	| height                      	|
| min-h 	| min-height                  	|
| max-h 	| max-height                  	|
| d     	| display                     	|
| bg    	| background-color            	|
| rounded   | border-radius            	    |




#### Special Properties
Some special properties have been provided for convenience!

#### Text
```HTML
<div class="text[xl]"></div>
```

becomes

```CSS
.text\[xl\] {
	font-size: 1.25rem;
	line-height: 1.75rem;
}
```

#### Text sizes

| label 	| font-size 	| line-height 	|
|-------	|-----------	|-------------	|
| xs    	| 0.75 rem  	| 1 rem       	|
| sm    	| 0.875 rem 	| 1.25 rem    	|
| md    	| 1 rem     	| 1.5 rem     	|
| lg    	| 1.125 rem 	| 1.75 rem    	|
| xl    	| 1.25 rem  	| 1.75 rem    	|
| 2xl   	| 1.5 rem   	| 2 rem       	|
| 3xl   	| 1.875 rem 	| 2.25 rem    	|
| 4xl   	| 2.25 rem  	| 2.5 rem     	|
| 5xl   	| 3 rem     	| 1           	|
| 6xl   	| 3.75 rem  	| 1           	|
| 7xl   	| 4.5 rem   	| 1           	|
| 8xl   	| 6 rem     	| 1           	|
| 9xl   	| 8 rem     	| 1           	|


#### Colors
Color helpers are provided to control the color, lightness and transparency. Colors can be set by specifiyng the `<Color Name>-<Lightness>\<Transparency>` 

 Color Name is one of
- red
- orange
- yellow
- lime
- green
- teal
- cyan
- azure
- blue
- purple
- gray
- grey
- black
- white


Lightness is a number from 0 to 1000 with 0 being 100% light and 1000 being 100% dark. 
Lightness can be ommited.

Transparency is a number between 0 and 100 where 0 is fully transparent and 100 is fully opaque. Transparency can be ommited.

*NB. Lightness has no effect on black and white*


```HTML
<div class="bg[red-500/75]"></div>
```

becomes

```CSS
:root {
    --theme-saturation: 80%;
    --hsla-red-500-75: hsla(0, var(--theme-saturation), 50%, 0.75);
}

.bg\[red-500\/75\] {
    background-color: var(--hsla-red-500-75);
}
```

#### Reacting to parents 
Sometimes you want a child styes to change depending on the class or state applied to a parent element

You can achieve this by prefixing your child class with a `.` and the class to be applied to the parent then separated by an `_`

In the following example, imagine `active` is dynamically applied and remove from the outer div.

```HTML
<div class="active">
    <div class=".active_bg[green]"></div>
</div>
```

Whenever the outer div has the class `active` applied, the child's background color will change to green.

#### Ancestor classes and pseudo-selectors



To respond to psuedo selectors on the parent, add a `:` and the pseudo selector.

```HTML
<div class="parent">
    <div class=".parent:hover_bg[green]"></div>
</div>
```

Whenever the div with the `parent` class is hovered, the child div will change its background color to green.





