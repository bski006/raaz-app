'use strict'
import React, {
  Component,
  View,
} from 'react-native'

import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {DetailStyles} from '../styles'


import F8Header from '../common/F8Header'
import F8Button from '../common/F8Button'
import Carmera from '../components/Carmera'


import {BuildList} from '../build'
import {buildsSelector, buildsPaginationSelector, buildCategoriesSelector} from '../selectors'
import {fetchCategoriesFromApi, fetchBuilds} from '../reducers/tuning/filterActions'

import {userIdSelector, profileSelector} from '../selectors'

import {setUserData} from '../reducers/user/userActions'
import {setAccessToken} from '../reducers/history/historyActions'

const mapStateToProps = (state, props) => {
  return {
    data: buildsSelector (state),
    pagination: buildsPaginationSelector(state),
    tags: buildCategoriesSelector (state),
    user: props.user,
    access_token: props.access_token
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchTags: () => { dispatch (fetchCategoriesFromApi ('car'))},
    fetchData: (pageUrl) => {dispatch (fetchBuilds (pageUrl))},
    setUserData: () => { dispatch (setUserData (props.user))},
    setAccessToken: () => {dispatch (setAccessToken (props.access_token))}
  }
}

class Tuning extends Component {
  constructor (props) {
    super (props)
  }

  componentWillMount() {
    this.props.setUserData()
    this.props.setAccessToken()
  }

  render () {
    const leftItem = {title: 'My Cars', onPress: Actions.MyBuilds}
        , rightItem = {title: 'Saved', onPress:Actions.WatchList}

    let {data, pagination, tags, userId, fetchTags, fetchData} = this.props
    return (
      <View style={{flex: 1, backgroundColor:'transparent'}}>
      <F8Header title="Tuning" foreground='dark' leftItem={leftItem} rightItem={rightItem}/>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: -1}}>
      <F8Button style={{flex: 1}}
                onPress={Actions.QRScan}
                type="search"
                icon={require ('../common/img/qr.png')}
                caption={"By QR Code"}/>
      <F8Button style={{flex: 1}}  onPress={Actions.Makes}
                caption="search by car" type="search"
                icon={require ('../common/img/search.png')}/>

      </View>
      <BuildList data={data} pagination={pagination} tags={tags} fetchTags={fetchTags} fetchData={fetchData}/>
      </View>
    )
  }
}

export default connect (mapStateToProps, mapDispatchToProps) (Tuning)
