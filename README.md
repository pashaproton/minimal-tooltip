# Tooltip

## Minimal JavaScript tooltip with no dependencies

To use the library just add styles and JavaScript
```
<link rel="stylesheet" href="...tooltip.min.css">
<script src="...tooltip.min.js"></script>
```

Then you can use tooltips
```
<p>Lorem ipsum dolor sit amet, <span data-title="The tooltip content">TEXT WITH TOOLTIP</span>, quis nostrud.</p>
```

By default tooltip displayed at the top of hovered element, but you can change position by add placement option
```
<a data-title="Tooltip content" data-placement="top | right | bottom | left">Example text</a>
```

You also can add delay before tooltip will appear

```
<a data-title="Tooltip content" data-delay="3000">Example text</a>
```

### Options
| Name      | Values                   | Default | Description                                           |
|-----------|--------------------------|:-------:|-------------------------------------------------------|
| content   | Any string               | N/A     | Content which will appear in the tooltip              |
| placement | top, right, bottom, left | top     | Placement of the tooltip.                             |
| delay     | any positive number      | 300     | Delay in milliseconds before the tooltip will appear. |
