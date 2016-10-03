'use strict'
import React, {
  Component,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import PostCard from '../Posts/PostCard'
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {fetchCarDetails} from '../reducers/tuning/filterActions'

import F8Header from '../common/F8Header'
import F8Button from '../common/F8Button'
import {Heading1, Heading2, Heading3, EmptyHeading, Paragraph} from '../common/F8Text'

import FullScreenLoadingView from '../components/FullScreenLoadingView'
import MetricsGraph from '../components/MetricsGraph'
import PartsGrid from './PartsGrid'
import PostsList from '../Posts/PostListView'
import {VRImage} from '../cardboard'

import {TuningBySpecStyles, General, ListingStyles, Specs, Titles, PartStyles} from '../styles'
const specIdSelector = (state) => (state.stockCar.selectedSpecId)
const specDetailsSelector = (state) => (state.entities.specDetails)
const specDetailsPagination = (state) => (state.pagination.specDetailsPagination)


const getSpecsDetailsEntities = createSelector (
  [specIdSelector, specDetailsSelector, specDetailsPagination],
  (specId, specsList, specsPagination) => {
    let ids = specsPagination[specId]?specsPagination[specId].ids:[]
    return ids.map (id=>specsList[id])
  }
)

const getSpecsDetailsPagination = createSelector (
  [specIdSelector, specDetailsPagination],
  (specId, specsPagination) => {
    return specsPagination[specId] || {}
  }
)


const mapStateToProps = (state) => {
  return {
    specsDetails: getSpecsDetailsEntities(state),
    specsPagination: getSpecsDetailsPagination(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSpecsDetails: (specId)=>{
      dispatch (fetchCarDetails (specId))
    }
  }
}

class TuningBySpec extends Component {

  constructor (props) {
    super (props)
    this.state = {
      specsDetails: props.specsDetails,
      specsPagination: props.specsPagination,
    }
  }

  componentWillMount () {
    let {specId, fetchSpecsDetails} = this.props
    fetchSpecsDetails(specId)
  }

  componentWillReceiveProps (nextProps) {
    let {specsPagination, specsDetails} = nextProps
      , specsInfo = this.state.specsDetails[0]
    this.setState ({
      specsDetails,
      specsPagination,
    })
  }


  render () {
    let {specsDetails, specsPagination} = this.state
      , specsInfo = this.state.specsDetails[0]
    if (specsPagination.isFetching || !specsInfo) return (<FullScreenLoadingView/>)
    else {
      const leftItem = {title: 'Back', onPress: ()=> {Actions.pop ()}}
          , {make, model, submodel, specId, tuning, specs, posts} = specsInfo
          , headerContent = (<F8Header title={(model + ' ' + submodel).toUpperCase()} foreground="dark" style={General.headerStyle} leftItem={leftItem}/>)

      let {
            cylinders, compressor, configuration,
            transmissionSpeed, transmission, drivenWheels, size,
          } = specs
        , graphKeys = ['horsepower', 'torque']

      const dataArray = graphKeys.map ((key)=>{return {name: key, value: specs[key]}})

      let tuningcomponent = (specsInfo.tuning && specsInfo.tuning.length )?(
                              <View>
                                <Heading3 style={Titles.buildSectionTitle}>{"Tuning By Categories"}</Heading3>
                                <PartsGrid data={tuning} specId={specId}/>
                                <F8Button onPress={()=>{Actions.TuningPager({specId})}} type="secondary" caption="Search Tuning!" style={ListingStyles.contactDealerButton}/>
                              </View>
                            ): (<View/>)
        , postsContent = posts?(
          <View>
          <Heading3 style={Titles.buildSectionTitle}>{"Posts"}</Heading3>
            <ScrollView
              style={PartStyles.partsScrollStyle}>
              {posts.map ((post, idx)=>(<PostCard key={`pc-${idx}`} data={post}/>))}
            </ScrollView>
          <F8Button onPress={()=>{Actions.PostsBySpecId({specId})}} type="secondary" caption="View All Posts" style={ListingStyles.contactDealerButton}/>
          </View>
        ):(<View/>)

        return (
          <View style={{flex: 1}}>
          <ParallaxScrollView
            backgroundColor="black"
            contentBackgroundColor="white"
            backgroundSpeed={1}
            parallaxHeaderHeight={300}
            renderStickyHeader={() => headerContent}
            stickyHeaderHeight={64}
            renderForeground={()=>{
              return (<View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                          <Heading1>{make.toUpperCase()}</Heading1>
                          <Heading1>{model.toUpperCase()}</Heading1>
                          <Heading1>{submodel.toUpperCase()}</Heading1>
                     </View>)

            }}
            renderBackground={() => <VRImage style={TuningBySpecStyles.VRImageHolder}/>}>
            <View style={{flex: 1}}>
            <Heading3 style={Titles.buildSectionTitle}>{"Specs"}</Heading3>
            <View style={{padding: 16}}>
            <Heading3 style={Specs.subtitle}>{size.toFixed(1) + ` L ${configuration}-${cylinders} ${compressor}`.toUpperCase()}</Heading3>
            <MetricsGraph data={[{entries:dataArray}]}/>
            <Heading3 style={Specs.subtitle}>{`${transmissionSpeed} speed ${transmission}`.toUpperCase()}</Heading3>
            <Heading3 style={Specs.subtitle}>{`${drivenWheels}`.toUpperCase()}</Heading3>
            </View>
            {postsContent}
            {tuningcomponent}
            </View>
          </ParallaxScrollView>
          </View>
        );
    }
  }
}

export default connect (mapStateToProps, mapDispatchToProps) (TuningBySpec)
