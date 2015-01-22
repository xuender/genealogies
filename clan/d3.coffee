###
d3.coffee
Copyright (C) 2015 ender xu <xuender@gmail.com>

Distributed under terms of the MIT license.
###
Date2Str = (d)->
  # 日期转换
  if typeof(d) == 'string'
    return d.substr(0, 10)
  if !Date.prototype.toISOString
    Date.prototype.toISOString = ->
      pad = (n)->
        n < 10 ? '0' + n : n
      "#{
        this.getUTCFullYear()
      }-#{
        pad(this.getUTCMonth() + 1)
      }-#{
        pad(this.getUTCDate())
      }T#{
        pad(this.getUTCHours())
      }:#{
        pad(this.getUTCMinutes())
      }:#{
        pad(this.getUTCSeconds())
      }.#{
        pad(this.getUTCMilliseconds())
      }Z"
  d.toISOString().substr(0, 10)
app.directive('clan', ->
  nw = 120
  nh = 56
  {
    restrict: 'E'
    scope:
      node: '='
      svgw: '='
      svgh: '='
      edit: '&'
      addc: '&'
    link: (scope, element, attrs)->
      tree = (t)->
        # 排序
        scope.svgw = if t.x + 200 > scope.svgw then t.x + 200 else scope.svgw
        scope.svgh = if t.y + 160 > scope.svgh then t.y + 160 else scope.svgh
        t.mx = t.x
        if t.C
          console.debug '排序 [ %s ] 的子女', t.N
          for c in t.C
            c.f = t
            c.x = t.mx
            c.y = t.y + nh + 50
            t.mx = if c.P then t.mx += (nw * 2) + 60 else t.mx += nw + 40
            tree(c)
            if c.mx > t.mx
              t.mx = c.mx
        if t.P
          w = ((nw + 10) * (t.P.length + 1)) + 50
          x = t.x
          if t.mx > t.x + w
            t.x += (t.mx - t.x - w) / 2
          else
            t.mx = t.x + w
          x = t.x
          for p in t.P
            x += nw + 10
            p.x = x
            p.y = t.y
        else
          if t.mx > t.x + nw + 40
            t.x += (t.mx - t.x - nw - 40) / 2

      pen = (t, svg)->
        console.info t
        g = svg.append('g')
          .attr('transform', "translate(#{ t.x }, #{ t.y })")
        gr = g.append('rect')
          .attr("width", nw)
          .attr('height', nh)
          .attr('x', 0)
          .attr('y', 0)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('transform', 'translate(1, 1)')
          .attr('stroke', '#dddddd')
          .attr('stroke-width', 3)
          .attr('opacity', 1)
        if t.G
          gr.attr('fill', '#7cb5ec')
        else
          gr.attr('fill', '#ffb58c')
        text = g.append('text')
          .attr('x', 5)
          .attr('y', 18)
          .attr('font-size', 11)
          .attr('fill', '#666666')
          .append('tspan')
          .text("#{ t.E }: #{ t.N }")
        if t.L
          text.append('tspan')
            .attr('x', 5)
            .attr('dy', 16)
            .text("生辰: #{ Date2Str(t.B) }")
        else
          gr.attr('stroke', 'black')
          text.append('tspan')
            .attr('x', 5)
            .attr('dy', 16)
            .text("忌日: #{ Date2Str(t.D) }")
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
          .on('click', (n)->
            scope.addc(
              node: t
            )
          )
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
        if t.P
          #w = (nw + 10) * (t.P.length + 1) + 50
          for p in t.P
            pg = svg.append('g')
              .attr('transform', "translate(#{ p.x }, #{ p.y })")
            pgr = pg.append('rect')
              .attr("width", nw)
              .attr('height', nh)
              .attr('x', 0)
              .attr('y', 0)
              .attr('rx', 5)
              .attr('ry', 5)
              .attr('transform', 'translate(1, 1)')
              .attr('stroke', '#dddddd')
              .attr('stroke-width', 3)
              .attr('opacity', 1)
            if p.G
              pgr.attr('fill', '#7cb5ec')
            else
              pgr.attr('fill', '#ffb58c')
            ptext = pg.append('text')
              .attr('x', 5)
              .attr('y', 18)
              .attr('font-size', 11)
              .attr('fill', '#666666')
              .append('tspan')
              .text("#{ p.E }: #{ p.N }")
            if p.L
              ptext.append('tspan')
                .attr('x', 5)
                .attr('dy', 16)
                .text("生辰: #{ Date2Str(p.B) }")
            else
              pgr.attr('stroke', 'black')
              ptext.append('tspan')
                .attr('x', 5)
                .attr('dy', 16)
                .text("忌日: #{ Date2Str(p.D) }")
            ptext.append('tspan')
              .attr('x', 5)
              .attr('dy', 16)
              .attr('cursor', 'pointer')
              .attr('font-family', 'FontAwesome')
              .attr('font-weight', 'normal')
              .attr('font-size', '16')
              .html('&#xf007')
              .on('click', (n)->
                scope.edit(
                  node: p
                )
              )
            ptext.append('tspan')
              .attr('dx', 4)
              .attr('cursor', 'pointer')
              .attr('font-family', 'FontAwesome')
              .attr('font-weight', 'normal')
              .attr('font-size', '16')
              .html('&#xf063')
              .on('click', (n)->
                scope.addc(
                  node: p
                )
              )
            console.info p
        if t.C
          for c in t.C
            pen c, svg
      scope.$watch('node', (n, o)->
        console.info n
        nt = angular.copy n
        nt.x = 0
        nt.y = 0
        tree(nt)
        console.debug nt
        d3.select(element[0]).select('svg').remove()
        svg = d3.select(element[0]).append("svg")
          .attr('width', scope.svgw)
          .attr('height', scope.svgh)
        pen(nt, svg, 0, 0)
      , true)
  }
)


