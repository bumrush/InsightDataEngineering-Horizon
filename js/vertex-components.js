var searchUrl = 'http://ec2-52-8-87-99.us-west-1.compute.amazonaws.com:3000/search?url=';
var dataUrl = 'http://ec2-52-8-87-99.us-west-1.compute.amazonaws.com:3000/data?id=';

var VertexListContainer = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidUpdate: function(nextProps, nextState) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="vertexListContainer">
        <VertexList data={this.state.data} />
      </div>
    );
  }
});

var VertexList = React.createClass({
  getInitialState: function() {
    return {neighbors: []};
  },
  componentWillReceiveProps: function(nextProps) {
    var n = nextProps.data[0];
    if(n != undefined) {
      console.log(n['Neighbors']['FirstDegree']);
      this.setState({neighbors: n['Neighbors']['FirstDegree']});
    }
  },
  render: function() {
    var vertexNodes = this.state.neighbors.map(function (vertex) {
      return (
        <Vertex key={vertex} vertexId={vertex}>
            {vertex}
        </Vertex>
      );
    });
    return (
      <div className="vertexList">
        {vertexNodes}
      </div>
    );
  }
});

var Vertex = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: dataUrl+this.props.vertexId,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });   
  },
  componentDidUpdate: function(nextProps, nextState) {
    var $vertexList = $('.vertexList');
    $vertexList.find('.vertex').sort(function (a, b) {
      console.log();
      var aVal = $($(a).find('.vertexPageRank')[0]).text();
      var bVal = $($(b).find('.vertexPageRank')[0]).text();
      return -aVal - -bVal;
    }).appendTo( $vertexList ); 
  },
  render: function() {
    return (
      <div className='vertex'>
        <h2 className='vertexUrl'>
          {this.state.data['URL']}
        </h2>
        <span className='vertexPageRank'>
          {this.state.data['PageRank']}
        </span>
      </div>
    );
  }
});

var Meshwork = React.createClass({
  getInitialState: function() {
    return {query: '', text: ''};
  },
  onChange: function(e) {
    this.setState({query: searchUrl+e.target.value, text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
  },
  render: function() {
    return (
      <div>
        <h3>Meshwork</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
        </form>
        <VertexListContainer url={this.state.query} />
      </div>
    );
  }
});

React.render(
  <Meshwork />,
  document.getElementById('content')
);
