import _ from 'lodash';
import React from 'react';


class NavMenuDecade extends React.Component {
  render() {
    const { startingYear } = this.props;

    const yearsRange = _.range(startingYear, startingYear + 10);
    const yearsContent = _.map(yearsRange, (year) => {
      return <p className='nav-menu-decade-year' key={ year }>{ year }</p>;
    });

    return (
      <div>
        <p className='nav-menu-decade-header'>{ startingYear }</p>
        <div className='nav-menu-decade-years'>
          { yearsContent }
        </div>
      </div>
    );
  }
}

NavMenuDecade.propTypes = {
  startingYear: React.PropTypes.number.isRequired
};

export default NavMenuDecade;
