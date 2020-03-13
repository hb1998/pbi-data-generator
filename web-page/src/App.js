import React from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios'
class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      dType: 'rows',
      noOfRows: 0,
      nodesInColumns: [1, 2]
    }
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleArrayChange = (idx, value) => {
    let nodesInColumns = this.state.nodesInColumns
    nodesInColumns[idx] = value
    this.setState({
      nodesInColumns
    })
  }

  addColumn = (ev) => {
    ev.preventDefault()
    if (this.state.nodesInColumns.length >= 5) {
      alert("Cannot be more than 5 columns");
      return
    }

    this.setState((prevState) => {
      const lastColumnNodes = prevState.nodesInColumns[prevState.nodesInColumns.length - 1]
      return {
        nodesInColumns: [...prevState.nodesInColumns, lastColumnNodes * 2]
      }
    })
  }
  handleDelete = (ev, index) => {
    ev.preventDefault();
    if (this.state.nodesInColumns.length <= 2) {
      alert("Cannot be less than 2 columns");
      return
    }
    let nodesInColumns = this.state.nodesInColumns
    nodesInColumns.splice(index, 1)
    this.setState({
      nodesInColumns
    })

  }

  sendData = async (ev) => {
    ev.preventDefault()
    if(this.state.dType === "rows" && this.state.noOfRows >230000){
      alert("Cannot be greater than 230000")
      return
    }
    try {
      const url = "http://localhost:8080/generateCsv"
      const response = await Axios.post(url, this.state)
      this.downloadData("http://localhost:8080/" + response.data)
    } catch (err) { console.error(err) }


  }
  downloadData = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
  }
  render() {
    const { dType, noOfRows, nodesInColumns } = this.state;
    const columnsTemplate = nodesInColumns.map((nodesInColumn, index) => (
      <div key={index} className="form-group">
        <label>columns {index + 1}</label>
        <div className="d-flex align-items-center" >
          <input className="form-control form-control-sm"
            value={nodesInColumn}
            name="noOfRows"
            onChange={((ev) => this.handleArrayChange(index, ev.target.value))}
            type="number"
            step={nodesInColumns[index - 1]}
          />
          <button className="btn btn-danger ml-2"
            onClick={(ev) => this.handleDelete(ev, index)}
          >Delete</button>
        </div>
      </div>
    ))

    return (
      <div className="App">
        <div className="container">
          <header>
            <h3>
              PowerBI Data Geneartor
          </h3>
          </header>
          <form>
            <div className="form-group">
              <label>Data type</label>
              <select onChange={this.handleChange} value={dType} name="dType" className="form-control form-control-sm">
                <option value="rows" >No. of Rows</option>
                <option value="columns" >No. of nodes in columns</option>
              </select>
            </div>

            {
              dType === 'rows' ?
                <div>
                  <div className="form-group">
                    <label>No.of Rows</label>
                    <input className="form-control form-control-sm" 
                    value={noOfRows} name="noOfRows" 
                    max="230000"
                    onChange={this.handleChange} type="number" />
                  </div>
                </div> :
                <>
                  {/* <div>
                    <label>No.of Columns</label>
                    <select onChange={this.handleChange} value={noOfColumns} name="noOfColumns" className="form-control form-control-sm">
                      <option value="2" >2</option>
                      <option value="3">3</option>
                      <option value="4" >4</option>
                      <option value="5" >5</option>
                    </select>
                  </div> */}
                  <div>
                    <label>
                      No.of columns &nbsp;
                  {nodesInColumns.length}
                    </label>
                  </div>
                  <button onClick={this.addColumn} className="btn btn-success">Add Column</button>

                  {columnsTemplate}

                </>
            }
            <button onClick={this.sendData} className="btn btn-primary">Generate</button>


          </form>
        </div>
      </div>
    )
  }
}

export default App;
