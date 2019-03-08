import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ReactTable from "react-table";
import 'react-table/react-table.css'


class App extends Component {
  state={
    data: [],
    keys:[]
  }

  componentDidMount () {
  this.fetchData()

  }

  fetchData = () =>{
    fetch('https://spreadsheets.google.com/feeds/list/1dNxjd0QJCqwGR42iWDczxz4gcPSeNFmTh_zf7hGGcbo/o4w8r8i/public/values?alt=json')
    .then(data=>data.json())
    .then(json=>json.feed.entry)
    .then(dataToParse=>this.parsingData(dataToParse))
    .then(googleChartData=>this.setState({
      data: googleChartData,
      keys: Object.keys(googleChartData[0])
    }))
  }

  parsingData = (data) => {
    return data.map(x=>{
      let obj= {
        "number": x.gsx$_cn6ca.$t,
        "city": x.gsx$city.$t,
        "country": x.gsx$country.$t,
        "all_Buildings": x.gsx$allbuildings.$t,
        "100m+": x.gsx$m.$t,
        "150m+": x.gsx$m_2.$t,
        "200m+": x.gsx$m_3.$t,
        "300m+": x.gsx$m_4.$t,
        "telecom_towers": x.gsx$telecomtowers.$t,
        "all_structures": x.gsx$allstructures.$t
      }
      return obj
    })
  }

  sortData = (data,method) => {
    let sortedData= data.sort(function (a, b) {
      if(method==="city"|| method==="country"){
        if(a[method] < b[method]) { return -1; }
        if(a[method] > b[method]) { return 1; }
        return 0;
      }
      else{
      return a[method] - b[method]
    }})
    return sortedData
  }

  createColumns= (keys)=>{
    let columns=[]
    keys.forEach(key=>{
      let header=key.split("_").join(" ").charAt(0).toUpperCase() + key.split("_").join(" ").slice(1)
      let obj={
        Header: header,
        accessor: key
      }
      columns.push(obj)
    })
    return columns
  }

  render() {
    return (

      <div className="App">
        <BrowserRouter>
         <Switch>
         <Route exact path="/" component={props=><ReactTable data={this.state.data} columns={this.createColumns(this.state.keys)}/>} />
         {(this.state.keys).map(key=>
           <Route exact path={`/${key}`} component={props=><ReactTable data={this.sortData(this.state.data,key)} columns={this.createColumns(this.state.keys)}/>} />
         )}
         </Switch>
        </BrowserRouter>

      </div>
    );
  }
}

export default App
