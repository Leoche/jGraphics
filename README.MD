![jGraphics Logo](/home/leo/Images/jgraphics.png)

## Installation
#### 1. First include jQuery before `</body>`
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
```

#### 2. Include jGraphics.js
From release
```html
<script src="jGraphics.js" type="text/javascript"></script>
```
Or from CDN hosted by [jsDelivr](https://www.jsdelivr.com/)
```html
<script src="//cdn.jsdelivr.net/gh/Leoche/jGraphics@1.0.0/jGraphics.js" type="text/javascript"></script>
```
#### 3. Create your Data

````html
<span class="graphics">2,3,5,4,6,5</span>
````

#### 4. Initialize the plugin

```html
<script type="text/javascript">
    (function($){
        $(".graphics").jGraphics();
    })(jQuery);
</script>
```

## Usage

Two types of data are accepted

- On dimension ( ',' is the separator): XX,XX,XX,XX,XX,XX,XX
- Two dimensions ( ':' is the separator): XX:YY,XX:YY,XX:YY,XX:YY,XX:YY,XX:YY,XX:YY

#### Options

| Options       | Value (default) | Description                                 |
| ------------- | --------------- | ------------------------------------------- |
| height        | 200             | Height of chart                             |
| width         | 300             | Width of chart                              |
| marginTop     | 1               | Number of blanks lines on top               |
| marginBottom  | 1               | Number of blanks lines on bottom            |
| marginLeft    | 1               | Number of blanks lines on right             |
| marginRight   | 1               | Number of blanks lines on right             |
| theme         | "light"         | Theme can be light or dark                  |
| circlesRadius | 5               | Radius of data points                       |
| strokeWidth   | 3               | Width of stroke                             |
| grid          | true            | Display a grid                              |
| color         | "red"           | Color of chart                              |
| origin        | false           | Start chart at 0;0                          |
| title         | false           | Title of chart can be false or string       |
| titlePosition | "bottom"        | Position of title                           |
| titleAlign    | "center"        | Text aligment                               |
| canSave       | true            | Add a button on hover to save image to file |
| authorLink    | true            | Add a link to my website (credits)          |

## Examples

### Example 1

```html
<span class="graphiques-ex1">1,2,1,3,2,2,1</span>
```

```js
$(".graphiques-ex1").jGraphics({
    width:640,
    height:150,
    color:"purple",
    circlesRadius:6,
    strokeWidth:4,
    grid:"horizontalonly",
    origin:true,
    canSave:false
});
```

Result:

![jGraphics](/home/leo/Images/jq0.png)

### Example 2

```html
<span class="graphiques-ex2">22/06:3,23/06:4,24/06:2,25/06:3</span>
```

```js
$(".graphiques-ex2").jGraphics({
    width:640,
    height:200,
    theme:"dark",
    color:"orange",
    title:"Mon graphique",
    titlePosition:"bottom",
    titleAlign:"center"
});
```

