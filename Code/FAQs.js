import React, { Fragment } from 'react'
import { Button } from 'react-native-paper'

import { DataTable } from 'react-native-paper'
import { TextInput, Text } from 'react-native-paper'
import { View, ScrollView } from 'react-native'

import MyHeader from './Header'
import MyStyles from './Styles'

import UserDataContext from './App/UserDataContext'

class ShowReportsAndEdit extends React.Component {
  state = { reports: [] }

  componentDidMount() {
    console.log(this.props.data)
    this.setState({ loading: true })

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }

    fetch('http://pablorosas.pythonanywhere.com/GetFaq', options)
      .then(response => {
        this.setState({ loading: false })

        if (response.ok) return response.json()
        else alert('Algo fue mal con el servidor')
      })
      .then(reports => {
        if (this.props.data.Type === 'Ing. Mantenimiento') {
          const result = reports.filter(r => r.Tipo === 'Mantenimiento')
          this.setState({ reports: result, ...result[0] })
        } else this.setState({ reports, ...reports[0] })
      })
  }

  render() {
    return (
      <Fragment>
        <MyHeader
          text="Profile"
          subtitle={this.props.data.Type}
          link="/"
          hasSetting
        />
        <View style={{ marginBottom: 85 }}>
          <ScrollView contentContainerStyle={MyStyles.content}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title numeric>No. Pregunta</DataTable.Title>
                <DataTable.Title>Pregunta</DataTable.Title>
                <DataTable.Title numeric>Likes</DataTable.Title>
                <DataTable.Title numeric>Dislikes</DataTable.Title>
              </DataTable.Header>

              {this.state.reports.map(report => (
                <DataTable.Row
                  key={report.NoPregu}
                  onPress={() => {
                    this.setState({ ...report })
                  }}
                >
                  <DataTable.Cell numeric>{report.NoPregu}</DataTable.Cell>
                  <DataTable.Cell>{report.Reporte}</DataTable.Cell>
                  <DataTable.Title numeric>{report.Likes}</DataTable.Title>
                  <DataTable.Title numeric>{report.Dislikes}</DataTable.Title>
                </DataTable.Row>
              ))}
            </DataTable>

            <View>
              <View style={MyStyles.sideIcon}>
                <TextInput
                  label="No. de Pregunta"
                  mode="outlined"
                  keyboardType="numeric"
                  style={MyStyles.input}
                  value={this.state.NoPregu}
                  onChange={e => this.setState({ NoPregu: e.nativeEvent.text })}
                />
              </View>

              <View style={MyStyles.sideIcon}>
                <TextInput
                  label="Pregunta"
                  mode="outlined"
                  style={MyStyles.input}
                  value={this.state.Pregunta}
                  onChange={e => this.setState({ Pregunta: e.nativeEvent.text })}
                />
              </View>

              <View style={MyStyles.sideIcon}>
                <TextInput
                  label="Respuesta"
                  mode="outlined"
                  multiline
                  style={MyStyles.input}
                  value={this.state.Respuesta}
                  onChange={e => this.setState({ Respuesta: e.nativeEvent.text })}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Fragment>
    )
  }
}

const ContextWrapper = props => (
  <UserDataContext.Consumer>
    {({ data }) => <ShowReportsAndEdit {...props} data={data} />}
  </UserDataContext.Consumer>
)

export default ContextWrapper
