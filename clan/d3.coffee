###
d3.coffee
Copyright (C) 2015 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
app.directive('clandef', ->
  {
    restrict: 'E'
    scope:
      node: '='
      edit: '&'
    link: (scope, element, attrs)->
      pen = (t, svg, x, y)->
        console.info t
        rw = 120
        rh = 76
        g = svg.append('g')
          .attr('transform', "translate(#{x}, #{y})")
        g.append('rect')
          .attr("width", rw)
          .attr('height', rh)
          .attr('x', 0)
          .attr('y', 0)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('isShadow', true)
          .attr('transform', 'translate(1, 1)')
        g.append('rect')
          .attr("width", rw)
          .attr('height', rh)
          .attr('x', 0)
          .attr('y', 0)
          .attr('strokeWidth', 2)
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 0.1)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('isShadow', true)
          .attr('transform', 'translate(1, 1)')
        g.append('rect')
          .attr("width", rw)
          .attr('height', rh)
          .attr('x', 0)
          .attr('y', 0)
          .attr('strokeWidth', 2)
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.15)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('isShadow', true)
          .attr('transform', 'translate(1, 1)')
        gr = g.append('rect')
          .attr("width", rw)
          .attr('height', rh)
          .attr('strokeWidth', 2)
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('rx', 5)
          .attr('ry', 5)
        if t.G
          gr.attr('fill', '#7cb5ec')
        else
          gr.attr('fill', '#ffb58c')
        text = g.append('text')
          .attr('x', 5)
          .attr('y', 18)
          .attr('font-size', 11)
        if t.L
          text.attr('color', 'white').attr('fill', 'white')
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
          .on('click', (n)->
            scope.edit(
              node: t
            )
          )
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf063')
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf061')
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf068')
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf067')
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf062')
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf00d')
        mx = x
        my = y + 160
        if t.C
          for c in t.C
            pen c, g, mx, my
            mx += 200
      scope.$watch('node', (n, o)->
        console.info n
        d3.select(element[0]).select('svg').remove()
        svg = d3.select(element[0]).append("svg")
          .attr('width', attrs.width)
          .attr('height', attrs.height)
          pen(n, svg, 0, 0)
      , true)
  }
)


