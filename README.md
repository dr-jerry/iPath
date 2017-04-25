# iPath
iPath is a javascript library for scripting reactive, customizable vector graphics, usable as SVG in your website or as DXF for CNC templates.

    var rect = new iPath().line(40,0).line(0,40).line(-40,0).line(0,-40);

creates a rectangle which can be assigned to an existing d attribute of an existing path:

    document.queryselector("path.class").setAttribute("d", rect.dPath(3));

where 3 represents the significance of the generated numbers. Above example is a very simple usecase for iPath. iPath has more improvements over SVG:

- polar coordinates
- closing with mirroring
- partial path rendering
- filleted line joints (simplified arcs)
- beziers and continuation with a weight.


More information on http://www.stretchsketch.com/presentation/ipath.html . iPath with real live usecases on http://www.stretchsketch.com
