###
d3.coffee
Copyright (C) 2015 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
app.directive('clan', ->
  {
    restrict: 'E'
    link: (scope, element, attrs)->
      svg = d3.select(element[0]).append("svg")
        .attr('width', attrs.width)
        .attr('height', attrs.height)
      pen = (t, svg, x, y)->
        console.info t
        g = svg.append('g')
          .attr('transform', "translate(#{x}, #{y})")
        g.append('rect')
          .attr("width", 120)
          .attr('height', 76)
        text = g.append('text')
          .attr('x', 5)
          .attr('y', 18)
        text.append('tspan')
          .text("#{ t.E }: #{ t.N }")
        text.append('tspan')
          .attr('x', 5)
          .attr('dy', 16)
          .text("生辰: #{ t.B | date:"yyyy-MM-dd" }")
        text.append('tspan')
          .attr('x', 5)
          .attr('dy', 16)
          .text("忌日: #{ t.D | date:"yyyy-MM-dd" }")
        text.append('tspan')
          .attr('x', 5)
          .attr('dy', 16)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf007')
        text.append('tspan')
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf007')
        mx = x
        my = y + 160
        if t.C
          for c in t.C
            pen c, g, mx, my
            mx += 200
      d3.json(attrs.url, (msg)->
        if msg.ok
          pen msg.data.t, svg, 0, 0
      )
  }
)


