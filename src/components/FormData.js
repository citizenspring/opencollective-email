import React from 'react';
import PropTypes from 'prop-types';
import withIntl from '../lib/withIntl';
import { Box, Flex } from '@rebass/grid';
import { get } from 'lodash';
import StyledInputField from './StyledInputField';
import StyledCard from './StyledCard';
import StyledCheckbox from './StyledCheckbox';

const timeOptions = [];
for (let i = 8; i < 24; i++) {
  timeOptions.push(`${i}h`);
}

class FormData extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    /** All props from `StyledCard` */
    ...StyledCard.propTypes,
  };

  constructor(props) {
    super(props);
    console.log('>>> formData', props);
    console.log('>>> languages: ', get(this.props, `data[languages]`, []));
    this.languagesValues = [
      'English',
      'French',
      'Dutch',
      'Arabic',
      'Italian',
      'Polish',
      'Romanian',
      'Spanish',
      'Turkish',
      'Brusseleer',
    ];
    this.kidsFriendlyValues = ['babies', 'toddlers', 'kids'];
  }

  getFieldProps(fieldname, value) {
    const checked = get(this.props, `data[${fieldname}]`, []).includes(value);
    return {
      fontSize: 'Paragraph',
      lineHeight: 'Paragraph',
      type: 'text',
      checked,
      disabled: !checked,
      width: 1,
      px: [1, 2, 3],
    };
  }

  render() {
    return (
      <Flex>
        <Box mb={4} width={2 / 3}>
          <StyledInputField label="Languages" description="What languages can you accommodate?" htmlFor="languages">
            {inputProps =>
              this.languagesValues.map(lang => (
                <Box my={2}>
                  <StyledCheckbox label={lang} {...inputProps} {...this.getFieldProps(inputProps.name, lang)} />
                </Box>
              ))
            }
          </StyledInputField>
        </Box>

        <Box mb={4} width={1 / 3}>
          <StyledInputField label="Kids friendly" description="Is your open door kid friendly?" htmlFor="kidsFriendly">
            {inputProps =>
              this.kidsFriendlyValues.map(lang => (
                <Box my={2}>
                  <StyledCheckbox label={lang} {...inputProps} {...this.getFieldProps(inputProps.name, lang)} />
                </Box>
              ))
            }
          </StyledInputField>
        </Box>
      </Flex>
    );
  }
}

export default withIntl(FormData);
