import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import {
  Button,
  Canvas,
  Form,
  FieldGroup,
} from 'datocms-react-ui';
import { useState, useCallback } from 'react';
import { Form as FormHandler } from 'react-final-form';
import JsonTextarea from '../components/JsonTextarea';
import { validateArray, validateGeneralOptions } from '../lib/validators';
import s from '../lib/styles.module.css';

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

type Parameters = {
  filters: string;
  generalOptions: string;
  icons: string;
  styles: string;
};

type State = {
  parameters: Parameters;
  valid: boolean;
};

const defaultParameters: Parameters = {
  filters: "[]",
  generalOptions: `{
    "iconPrefix": ""
  }`,
  icons: "[]",
  styles: "",
};

export default function ConfigScreen({ ctx }: PropTypes) {
  const [state, setState] = useState<State>({
		parameters: ctx.plugin.attributes.parameters as Parameters,
		valid: false,
	});

	const handleOnChange = useCallback((partialParameters: Partial<Parameters>) => {
		setState((current) => ({
			valid: true,
			parameters: {
        ...current.parameters,
				...partialParameters,
			},
		}));
	}, []);

	const handleOnError = useCallback(() => {
		setState(current => ({
			...current,
			valid: false,
		}));
	}, []);

  return (
    <Canvas ctx={ctx}>
      <FormHandler<Parameters>
        initialValues={ctx.plugin.attributes.parameters}
        onSubmit={async () => {
          await ctx.updatePluginParameters(state.parameters);
          setState(current => ({
            ...current,
            valid: false,
          }));
          ctx.notice('Settings updated successfully!');
        }}
      >
        {({ handleSubmit, submitting }) => (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <>
                <label className={s["form-label"]}>General Options</label>
                <JsonTextarea
                  label="General Options"
                  initialValue={state.parameters.generalOptions || defaultParameters.generalOptions}
                  validate={validateGeneralOptions}
                  onValidChange={(value) => handleOnChange({ generalOptions: value})}
                  onError={handleOnError}
                />

                <label className={s["form-label"]}>Icon names</label>
                <JsonTextarea
                  label="Icon Names"
                  initialValue={state.parameters.icons || defaultParameters.icons}
                  validate={validateArray}
                  onValidChange={(value) => handleOnChange({ icons: value})}
                  onError={handleOnError}
                />

                <label className={s["form-label"]}>Filters</label>
                <JsonTextarea
                  label="Filters"
                  initialValue={state.parameters.filters  || defaultParameters.filters}
                  validate={validateArray}
                  onValidChange={(value) => handleOnChange({ filters: value})}
                  onError={handleOnError}
                />

                <label className={s["form-label"]}>CSS Styles</label>
                <textarea
                  className={s["form-textarea"]}
                  placeholder="Insert CSS styles here"
                  value={state.parameters.styles || defaultParameters.styles}
                  onChange={(e) => handleOnChange({ styles: e.target.value})}
                  onError={(e) => handleOnError()}
                  required
                  spellCheck={false}
                  autoCapitalize="off"
                />
              </>
            </FieldGroup>
            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={submitting || !state.valid}
            >
              Save settings
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}
