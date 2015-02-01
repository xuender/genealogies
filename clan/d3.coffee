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
  nt = {}
  cn = {}
  {
    restrict: 'E'
    scope:
      node: '='
      svgw: '='
      svgh: '='
      edit: '&'
      addc: '&'
      addp: '&'
      addf: '&'
      toggle: '&'
      remove: '&'
      children: '&'
    link: (scope, element, attrs)->
      tree = (t)->
        # 排序
        tt = nt[t.Id]
        if t.P and t.P.length > 0
          scope.svgw = if tt.x + 200 + (t.P.length * 150) > scope.svgw then tt.x + 200 + (t.P.length * 150) else scope.svgw
        else
          scope.svgw = if tt.x + 200 > scope.svgw then tt.x + 200 else scope.svgw
        scope.svgh = if tt.y + 160 > scope.svgh then tt.y + 160 else scope.svgh
        tt['mx'] = tt.x
        if t.C
          console.debug '排序 [ %s ] 的子女', t.N
          for c in t.C
            nt[c.Id] =
              f: t.Id
              x: tt.mx
              y: tt.y + nh + 50
            tt.mx = if c.P and c.P.length > 0 then tt.mx += (nw * 2) + 60 else tt.mx += nw + 40
            tree(c)
            if nt[c.Id].mx > tt.mx
              tt.mx = nt[c.Id].mx
        if t.P and t.P.length > 0
          w = ((nw + 10) * (t.P.length + 1)) + 50
          if tt.mx > tt.x + w
            tt.x += (tt.mx - tt.x - w) / 2
          else
            tt.mx = tt.x + w
          x = tt.x
          for p in t.P
            x += nw + 10
            nt[p.Id] =
              x: x
              y: tt.y
        else
          if tt.mx > tt.x + nw + 40
            tt.x += (tt.mx - tt.x - nw - 40) / 2

      pen = (t, svg)->
        g = svg.append('g')
          .attr('transform', "translate(#{ nt[t.Id].x }, #{ nt[t.Id].y })")
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
        tsp = text.append('tspan')
        tsp.attr('cursor', 'pointer')
          .attr('text-decoration', 'underline')
        tsp.text("#{ t.E }: #{ t.N }")
          .on('click', (n)->
            scope.edit(
              node: t
            )
          )
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
        isS = true
        if t.C && t.C.length > 0
          isS = false
          text.append('tspan')
            .attr('x', 5)
            .attr('dy', 16)
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf147')
            .on('click', (n)->
              console.info 'toggle'
              scope.toggle(
                node: t
              )
              reset scope.node
            )
        if t._C
          isS = false
          text.append('tspan')
            .attr('x', 5)
            .attr('dy', 16)
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf196')
            .on('click', (n)->
              console.info 'toggle'
              scope.toggle(
                node: t
              )
              reset scope.node
            )
        st = text.append('tspan')
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf1ae')
          .on('click', (n)->
            scope.addc(
              node: t
            )
          )
        if isS
          st.attr('x', 5).attr('dy', 16)
        else
          st.attr('dx', 4)
        text.append('tspan')
          .attr('dx', 4)
          .attr('cursor', 'pointer')
          .attr('font-family', 'FontAwesome')
          .attr('font-weight', 'normal')
          .attr('font-size', '16')
          .html('&#xf228')
          .on('click', (n)->
            scope.addp(
              node: t
            )
          )
        if 'f' not of nt[t.Id]
          text.append('tspan')
            .attr('dx', 4)
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf062')
            .on('click', (n)->
              scope.addf(
                node: t
              )
            )
        console.info cn
        if cn.isRemove(t)
          text.append('tspan')
            .attr('dx', 4)
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf235')
            .on('click', (n)->
              scope.remove(
                node: t
              )
            )
        if t.P and t.P.length > 0
          #w = (nw + 10) * (t.P.length + 1) + 50
          for p in t.P
            penP p, t, svg
        if t.C
          for c in t.C
            pen c, svg
          for c in t.C
            to = 'C 0 39 ' + (nt[c.Id].x - nt[nt[c.Id].f].x + 15) + ' 5 ' + (nt[c.Id].x - nt[nt[c.Id].f].x + 20) + ' 44'
            svg.append('path')
              .attr('transform', "translate(#{
                nt[nt[c.Id].f].x + 15
              }, #{
                nt[nt[c.Id].f].y + nh + 3
              })")
              .attr('d', "M 0 0 #{
                to
              }")
              .attr('fill', 'none')
              .attr('stroke', '#87a35c')
              .attr('stroke-width', 2)
      penP = (p, t, svg)->
        # 画伴侣
        pg = svg.append('g')
          .attr('transform', "translate(#{ nt[p.Id].x }, #{ nt[p.Id].y })")
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
        sp = ptext.append('tspan')
          .text("#{ p.E }: #{ p.N }")
          .attr('cursor', 'pointer')
          .attr('text-decoration', 'underline')
        sp.on('click', (d, i)->
            console.info d
            console.info p.Id
            scope.edit(
              node: p
            )
          )
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
        pf = true
        if cn.hasChildren t
          pf = false
          ptext.append('tspan')
            .attr('x', 5)
            .attr('dy', 16)
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf1ae')
            .on('click', (n)->
              scope.children(
                t: t
                p: p
              )
              #reset scope.node
            )
        if not ((p.C and p.C.length > 0))
          pr = ptext.append('tspan')
            .attr('cursor', 'pointer')
            .attr('font-family', 'FontAwesome')
            .attr('font-weight', 'normal')
            .attr('font-size', '16')
            .html('&#xf235')
            .on('click', (n)->
              scope.remove(
                node: p
              )
            )
          if pf
            pr.attr('x', 5).attr('dy', 16)
          else
            pr.attr('dx', 4)
        if t.C and t.C.length > 0 and p.C and p.C.length > 0
          for c in p.C
            console.info '划线', c.N
            to = 'C 0 39 ' + (nt[c.Id].x - nt[p.Id].x + 75) + ' 5 ' + (nt[c.Id].x - nt[p.Id].x + 70) + ' 44'
            pg.append('path')
              .attr('transform', "translate(#{
                15
              }, #{
                nh + 3
              })")
              .attr('d', "M 0 0 #{
                to
              }")
              .attr('fill', 'none')
              .attr('stroke', '#a3875c')
              .attr('stroke-width', 2)
      reset =(n)->
        console.info 'node修改', n
        nt = {}
        nt[n.Id]=
          x: 0
          y: 0
        scope.svgw = 600
        scope.svgh = 400
        cn = new CheckNode n
        tree(n)
        d3.select(element[0]).select('svg').remove()
        svg = d3.select(element[0]).append("svg")
          .attr('width', scope.svgw)
          .attr('height', scope.svgh)
        pen(n, svg, 0, 0)
      scope.$watch('node', (n, o)->
        reset n
      , true)
  }
)


