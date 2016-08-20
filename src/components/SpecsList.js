'use strict'

import React, {
  Component,
  View,
  ListView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'

import F8Header from '../common/F8Header'
import FullScreenLoadingView from './FullScreenLoadingView'
import PureListView from '../common/PureListView'
import ListContainer from '../common/ListContainer'
import MultipleChoice from 'react-native-multiple-choice'

import keys from 'lodash/keys'
import { FilterStyles } from '../styles'

import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { syncSpec } from '../reducers/history/historyActions'
import { setSpecId } from '../reducers/stockCar/filterActions'

const mapStateToProps = (state) => {
  let specIds = keys(state.entities.specs).sort(),
      specs = specIds.map ((id)=>state.entities.specs[id])

  return {
    specs,
    userId: state.user.profileData.user_id,
    selectedSubmodel: state.stockCar.selectedSubmodel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveSpecId: (userId, specId) => {
      dispatch (syncSpec (userId, specId))
    },
    setSelectedSpecId: (specId) => {
      dispatch (setSpecId (specId))
    }
  }
}
class SpecsList extends Component {
  _innerRef: ?PureListView;

  constructor (props) {
    super (props)
    this._innerRef = null
    this.storeInnerRef = this.storeInnerRef.bind (this)
    this.state = {
      specs: props.specs,
      selectedSubmodel: props.selectedSubmodel,
      isFetching: true,
    }
  }

  componentWillMount () {
    let {specs, selectedSubmodel, isFetching} = this.props
    this.setState ({specs, selectedSubmodel, isFetching: true})
  }


  componentWillReceiveProps (nextProps) {
    let {specs} = nextProps,
        isFetching = specs.length?false:true
    this.setState ({specs, isFetching})
  }

  render () {
    let {specs, selectedSubmodel, isFetching} = this.state,
        {saveSpecId, userId, setSelectedSpecId} = this.props
    const leftItem = {
            title: 'Back',
            onPress: ()=>Actions.pop(),
          },
    content = isFetching?(<FullScreenLoadingView/>):(
                <ScrollView style={FilterStyles.optionsContainer}>
                  <MultipleChoice
                    maxSelectedOptions={1}
                    renderText={(option)=> {
                        let {
                         cylinders, compressor, configuration,
                         transmissionSpeed, transmission, drivenWheels,size,
                         specId, horsepower
                         } = option
                        return (
                          <TouchableOpacity onPress={()=>{
                            setSelectedSpecId (specId)
                            saveSpecId (userId, specId)
                            Actions.TuningBySpec ({specId: specId})
                          }}>
                          <Text style={FilterStyles.multipleChoiceText}>
                            { `${horsepower} HP ` + size.toFixed(1) + ` L ${configuration}-${cylinders} ${compressor}`}
                          </Text>
                          </TouchableOpacity>
                        )
                    }}
                    options={this.state.specs}
                    selectedOptions={[]}
                    renderSeparator={(option)=>{return (<View/>)}}
                    renderIndicator={(option)=>{return (<View/>)}}/>
                </ScrollView>
              )
    return (
      <View style={FilterStyles.container}>
        <F8Header
          foreground="dark"
          title={"Specs"}
          leftItem={leftItem}
          style={FilterStyles.headerStyle}/>
          {content}
      </View>
    )
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }


  scrollTo(...args: Array<any>) {
    this._innerRef && this._innerRef.scrollTo(...args);
  }

  getScrollResponder(): any {
    return this._innerRef && this._innerRef.getScrollResponder();
  }

}

export default connect (mapStateToProps, mapDispatchToProps) (SpecsList)
