import React, { PureComponent } from 'react';
import { Collapse, Container, HorizontalGroup, Field, Select, Switch } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { IpVersion, Settings } from 'types';
import { FormLabel } from './utils';

interface Props {
  settings: Settings;
  isEditor: boolean;
  onUpdate: (settings: Settings) => void;
}

interface State {
  ipVersion: IpVersion;
  dontFragment: boolean;
  collapseOptions: boolean;
}

export class PingSettingsForm extends PureComponent<Props, State> {
  state: State = {
    ipVersion: this.props.settings!.ping?.ipVersion || IpVersion.Any,
    dontFragment: this.props.settings!.ping?.dontFragment || false,
    collapseOptions: false,
  };

  onUpdate = () => {
    const settings = {
      ping: {
        ipVersion: this.state.ipVersion,
        dontFragment: this.state.dontFragment,
      },
    };
    this.props.onUpdate(settings);
  };

  onIpVersionChange = (value: SelectableValue<IpVersion>) => {
    this.setState({ ipVersion: value.value || IpVersion.Any }, this.onUpdate);
  };

  onDontFragmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ dontFragment: !this.state.dontFragment }, this.onUpdate);
  };

  onToggleOptions = (isOpen: boolean) => {
    this.setState({ collapseOptions: !this.state.collapseOptions });
  };

  render() {
    const { ipVersion, dontFragment, collapseOptions } = this.state;
    const { isEditor } = this.props;

    const options = [
      {
        label: 'Any',
        value: IpVersion.Any,
      },
      {
        label: 'V4',
        value: IpVersion.V4,
      },
      {
        label: 'V6',
        value: IpVersion.V6,
      },
    ];
    return (
      <Container>
        <Collapse label="Advanced Options" collapsible={true} onToggle={this.onToggleOptions} isOpen={collapseOptions}>
          <HorizontalGroup>
            <div>
              <Field
                label={<FormLabel name="IP Version" help="The IP protocol of the ICMP request" />}
                disabled={!isEditor}
              >
                <Select value={ipVersion} options={options} onChange={this.onIpVersionChange} />
              </Field>
            </div>
            <div>
              <Field
                label={<FormLabel name="Don't Fragment" help="Set the DF-bit in the IP-header. Only works with ipV4" />}
                disabled={!isEditor}
              >
                <Container padding="sm">
                  <Switch value={dontFragment} onChange={this.onDontFragmentChange} disabled={!isEditor} />
                </Container>
              </Field>
            </div>
          </HorizontalGroup>
        </Collapse>
      </Container>
    );
  }
}
