let width = document.getElementById("vis").offsetWidth;
let height = document.getElementById("vis").offsetHeight;
let colorSize = 5;
let imgWidth = 750;
let groups = ['1', '2', '3', '4', '5', '6', '7', '8'];
let colx = Math.floor(imgWidth / (colorSize * 3));
let coly = Math.floor(height / (colorSize * 3));
let imageNames = ["IMG_6571", "IMG_6577", "IMG_6591", "IMG_6611", "IMG_6630", "IMG_6641", "IMG_6644", "IMG_6648", "na", "na", "na", "na", "na"];
let imageSelect = ["IMG_0000", "IMG_6571", "IMG_6571-0", "IMG_6571-1", "IMG_6571-2", "IMG_6571-3", "IMG_6571-4", "IMG_6571-5"];
let colorx = d3.scaleLinear().domain([0, 1]).range([3 * colorSize, imgWidth - 3 * colorSize]);
let colory = d3.scaleLinear().domain([0, 1]).range([3 * colorSize, height - 3 * colorSize]);
let cx = d3.scaleLinear().domain([0, colx]).range([3 * colorSize, imgWidth - 3 * colorSize]);
let cy = d3.scaleLinear().domain([0, coly]).range([height - 3 * colorSize, 3 * colorSize]);
let cData;

let init = () => {
  //Get the Data from the json objects
  cData = d3.json("doc/2.json").then(data => {

    /* Add color group to the Data */
    data.forEach(d => {
      d.group = d3.scaleQuantize()
        .domain([0, 360])
        .range(groups)(d.h);
    });



    /* Load IMAGES for initial sections*/

    //add svg for intro frame.
    let firstFrame = d3.select("#vis")
      .append('svg')
      .attr('id', "firstFrame")
      .attr('width', width)
      .attr('height', height)
      .style("position", "absolute");

    //add image defs for intro frame.
    let firstFrameDefs = firstFrame.append("defs")

    firstFrameDefs.selectAll("pattern")
      .data(imageNames).enter()
      .append("pattern")
      .attr("id", d => d)
      .attr("width", 1)
      .attr("height", 1)
      .append("svg:image")
      .attr("xlink:href", d => (d !== "na") ? "images/" + d + ".jpg" : "")
      .attr("height", height * 0.4);

    //add svg for color selection frame
    let imageFrame = d3.select("#vis")
      .append('svg')
      .attr('id', "imageFrame")
      .attr('width', width)
      .attr('height', height)
      .style("position", "absolute");
    //add image defs for intro frame.
    let imageFrameDefs = imageFrame.append("defs")

    imageFrameDefs.selectAll("pattern")
      .data(imageSelect).enter()
      .append("pattern")
      .attr("id", d => "i" + d)
      .attr("width", 1)
      .attr("height", 1)
      .append("svg:image")
      .attr("xlink:href", d => "images/" + d + ".jpg")
      .attr("height", height);

    // Create a Random Pack for first frame.
    let firstFramePack = d3.pack()
      .size([width * 0.5, height])
      .padding(3)
      (d3.hierarchy({
          children: imageNames
        })
        .sum(d => (d !== "na") ? d3.randomUniform(height * 0.1, height * 0.3)() : d3.randomUniform(0, height * 0.1)()));

    //Add circles to the first Frame and add images.
    firstFrame.selectAll("circle")
      .data(firstFramePack.children).enter()
      .append("circle")
      .attr('r', d => d.r)
      .attr('cx', d => width * 0.5 + d.x)
      .attr('cy', d => d.y)
      .style('fill', d => (d.data !== "na") ? "url(#" + d.data + ")" : d3.interpolateWarm(d3.randomUniform(0, 1)()))
      .style("opacity", 0);

    //Add Rect to the image Frame and add images.
    imageFrame.selectAll("rect")
      .data(imageSelect).enter()
      .append("rect")
      .attr("width", imgWidth)
      .attr("height", height)
      .attr("x", width - imgWidth)
      .attr("y", 0)
      .style('fill', d => "url(#i" + d + ")")
      .style("opacity", (d, i) => (i === 0) ? 1 : 0);


    /* IMAGE COLORS */
    let imageColors = data.filter(d => d.img_name == imageSelect[1]);

    let imgColorDot = d3.select("#vis")
      .append('svg')
      .attr('id', "imgColorDot")
      .attr('width', width)
      .attr('height', height)
      .style("position", "absolute");

    imgColorDot.selectAll("circle")
      .data(imageColors)
      .join("circle")
      .attr('r', 30)
      .attr('cx', d => d3.scaleLinear().domain([1, 5]).range([width - imgWidth + 30 * 2, width - 30 * 2])(d.color_no))
      .attr('cy', height - 30 * 2)
      .attr('fill', d => "#" + d.rgb)
      .style("opacity", 0);

    /* All COlor Data */
    let colorSvg = d3.select("#vis")
      .append('svg')
      .attr('id', "colorSvg")
      .attr('width', width)
      .attr('height', height)
      .style("position", "absolute");

    colorSvg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', colorSize)
      .attr('cx', (d, i) => cx(i % colx) + width - imgWidth)
      .attr('cy', (d, i) => cy(Math.floor(+(i / colx) % coly)))
      .attr('fill', d => '#' + d.rgb)
      .style('opacity', 0);




    /* Making hierarchy of the colors */

    /*
    let colorNest = d3.nest()
      .key(d => d.group)
      .entries(data)
      .map(d => {
        return {
          "key": d.key,
          "children": d.values
        }
      });

    let colorPack = d3.pack()
      .size([width * 0.5, height])
      .padding(3)(d3.hierarchy({
        children: colorNest
      }).count());
    
    let colorPackSvg = d3.select("#vis")
      .append('svg')
      .attr('id', "colorPackSvg")
      .attr('width', width)
      .attr('height', height)
      .style("position", "absolute");

    colorPackSvg
      .selectAll('circle')
      .data(colorPack.descendants())
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('cx', d => width * 0.5 + d.x)
      .attr('cy', d => d.y)
      .style('fill', d => (d.height == 0) ? d.data.rgb : "#ffffff00")
      .style('opacity', 0);
    */
    return data;
  });

}
init();

let simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody().strength(0.5))
  // .force('x', d3.forceX().x(d => d3.scaleLinear().domain([0, groups.length]).range([width - imgWidth + 3 * colorSize, width - 3 * colorSize])(d.group))
  .force('x', d3.forceX().x(d => d3.scaleLinear().domain([1, 5]).range([width - imgWidth + 3 * colorSize, width - 3 * colorSize])(d.color_no)).strength(0.2))
  .force("y", d3.forceY(height / 2).strength(0.02))
  .force('collision', d3.forceCollide().radius(colorSize))
  .on('tick', () => {
    var u = d3.select("#colorSvg")
      .selectAll('circle')
    // .data(data)

    u.enter()
      .append('circle')
      .attr('r', colorSize)
      .merge(u)
      .attr('cx', d => d.x = Math.max(width - imgWidth + colorSize * 3, Math.min(width - 3 * colorSize, d.x)))
      .attr('cy', d => d.y = Math.max(colorSize * 3, Math.min(height - 3 * colorSize, d.y)));
    u.exit().remove()

  });
cData.then(data => {
  simulation.nodes(data).alpha(1).restart();
});
// simulation.stop();

function canvasTransition(i, t) {
  console.log(t.scrollDirection);
  console.log(i);
  let firstFrame = d3.select("#firstFrame").selectAll('circle').transition().duration(500).ease(d3.easeCubicOut);
  let imageFrame = d3.select("#imageFrame").selectAll('rect').transition().duration(500).ease(d3.easeCubicOut);
  let imgColorDots = d3.select("#imgColorDot").selectAll('circle').transition().duration(500).ease(d3.easeCubicOut);
  let colorSvg = d3.select("#colorSvg").selectAll('circle').transition().duration(500).ease(d3.easeCubicOut);

  if (t.scrollDirection == "FORWARD") {
    switch (i) {
      case 0:
        break;
      case 1:
        imageFrame.style("opacity", 0);
        firstFrame.style("opacity", 0.8);
        break;
      case 2:
        firstFrame.style('fill', (d, i) => {
            if (i == 0)
              return "url(#i" + imageSelect[1] + ")";
            else
              return (d.data !== "na") ? "url(#" + d.data + ")" : d3.interpolateWarm(d3.randomUniform(0, 1)());
          })
          .style("opacity", (d, i) => (i === 0) ? 0.8 : 0)
          .attr('cx', width - imgWidth + height * 0.5)
          .attr('cy', height * 0.5)
          .attr("r", (d, i) => (i === 0) ? height * 0.5 : d.r)
          .transition().duration(600).style("opacity", 0);
        imageFrame.delay(400).style("opacity", (d, i) => (i === 1) ? 1 : 0);
        break;
      case 3:
        imageFrame.style("opacity", (d, i) => (i === 3) ? 1 : 0);
        imgColorDots.style("opacity", (d, i) => (i === 0) ? 1 : 0);
        break;
      case 4:
        imageFrame.style("opacity", (d, i) => (i === 4) ? 1 : 0);
        imgColorDots.style("opacity", (d, i) => (i === 1) ? 1 : 0);
        break;
      case 5:
        imageFrame.style("opacity", (d, i) => (i === 5) ? 1 : 0);
        imgColorDots.style("opacity", (d, i) => (i === 2) ? 1 : 0);
        break;
      case 6:
        imageFrame.style("opacity", (d, i) => (i === 6) ? 1 : 0);
        imgColorDots.style("opacity", (d, i) => (i === 3) ? 1 : 0);
        break;
      case 7:
        imageFrame.style("opacity", (d, i) => (i === 7) ? 1 : 0);
        imgColorDots.style("opacity", (d, i) => (i === 4) ? 1 : 0);
        break;
      case 8:
        imageFrame.style("opacity", (d, i) => (i === 2) ? 1 : 0);
        imgColorDots.style("opacity", 1);
        break;
      case 9:
        imageFrame.style("opacity", 0);
        imgColorDots.attr("r", colorSize)
          .attr('cx', (d, i) => cx(i % colx) + width - imgWidth)
          .attr('cy', (d, i) => cy(Math.floor(+(i / colx) % coly)))
          .transition()
          .delay(200)
          .duration(400)
          .style("opacity", 0);
        simulation.stop();
        colorSvg.delay(400)
          .style("opacity", 1)
          .attr('cx', (d, i) => cx(i % colx) + width - imgWidth)
          .attr('cy', (d, i) => cy(Math.floor(+(i / colx) % coly)));
        break;
      case 10:
        colorSvg.attr('cx', d => colorx(d.h / 360) + width - imgWidth)
          .attr('cy', d => colory(d.s / 100));
        break;
      case 11:
        colorSvg.attr('cx', d => colorx(d.s / 100) + width - imgWidth)
          .attr('cy', d => colory(d.v / 100));
        break;
      case 12:
        colorSvg.attr('cx', d => colorx(d.h / 360) + width - imgWidth)
          .attr('cy', d => colory(d.v / 100));
        break;
      case 13:
        simulation
          .force('x', d3.forceX().x(d => d3.scaleLinear().domain([1, 5]).range([width - imgWidth + 3 * colorSize, width - 3 * colorSize])(d.color_no)))
          .alpha(1).restart();
        break;
      case 14:
        simulation
          .force('x', d3.forceX().x(d => d3.scaleLinear().domain([1, groups.length]).range([width - imgWidth + 3 * colorSize, width - 3 * colorSize])(d.group)))
          .alpha(1).restart();
        break;
      case 15:
        break;
    }


  }
  // console.log(t.scrollDirection);
  if (t.scrollDirection == "REVERSE") {
    switch (i) {
      case 0:
        firstFrame.style("opacity", 0);
        imageFrame.style("opacity", (d, i) => (i === 0) ? 1 : 0);
        break;
      case 1:
        imageFrame.style("opacity", 0);
        firstFrame.attr('r', d => d.r)
          .attr('cx', d => width * 0.5 + d.x)
          .attr('cy', d => d.y)
          .style('fill', d => (d.data !== "na") ? "url(#" + d.data + ")" : d3.interpolateWarm(d3.randomUniform(0, 1)()))
          .style("opacity", 0.8);
        break;
      case 2:
        imgColorDots.style("opacity", 0);
        imageFrame.delay(400).style("opacity", (d, i) => (i === 1) ? 1 : 0);
        break;
      case 3:
        imgColorDots.style("opacity", (d, i) => (i === 0) ? 1 : 0);
        imageFrame.style("opacity", (d, i) => (i === 3) ? 1 : 0);
        break;
      case 4:
        imgColorDots.style("opacity", (d, i) => (i === 1) ? 1 : 0);
        imageFrame.style("opacity", (d, i) => (i === 4) ? 1 : 0);
        break;
      case 5:
        imgColorDots.style("opacity", (d, i) => (i === 2) ? 1 : 0);
        imageFrame.style("opacity", (d, i) => (i === 5) ? 1 : 0);
        break;
      case 6:
        imgColorDots.style("opacity", (d, i) => (i === 3) ? 1 : 0);
        imageFrame.style("opacity", (d, i) => (i === 6) ? 1 : 0);
        break;
      case 7:
        imgColorDots.style("opacity", (d, i) => (i === 4) ? 1 : 0);
        imageFrame.style("opacity", (d, i) => (i === 7) ? 1 : 0);
        break;
      case 8:
        colorSvg.style("opacity", 0);

        imageFrame.style("opacity", (d, i) => (i === 2) ? 1 : 0);
        imgColorDots.style("opacity", 1).attr('r', 30)
          .attr('cx', d => d3.scaleLinear().domain([1, 5]).range([width - imgWidth + 30 * 2, width - 30 * 2])(d.color_no))
          .attr('cy', height - 30 * 2);
        break;
      case 9:
        colorSvg.attr('cx', (d, i) => cx(i % colx) + width - imgWidth)
          .attr('cy', (d, i) => cy(Math.floor(+(i / colx) % coly)));
        break;
      case 10:
        colorSvg.attr('cx', d => colorx(d.h / 360) + width - imgWidth)
          .attr('cy', d => colory(d.s / 100));
        break;
      case 11:
        colorSvg.attr('cx', d => colorx(d.s / 100) + width - imgWidth)
          .attr('cy', d => colory(d.v / 100));
        break;
      case 12:
        colorSvg.attr('cx', d => colorx(d.h / 360) + width - imgWidth)
          .attr('cy', d => colory(d.v / 100));
        simulation.stop();
        break;
      case 13:
        simulation
          .force('x', d3.forceX().x(d => d3.scaleLinear().domain([1, 5]).range([width - imgWidth + 3 * colorSize, width - 3 * colorSize])(d.color_no)))
          .alpha(1).restart();
        break;
      case 14:
        break;
      case 15:
        break;
    }
  }

}