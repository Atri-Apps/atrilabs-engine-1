import { useMemo } from "react";
import { usePageRoutes } from "../../hooks/usePageRoutes";
import { ComponentProps } from "../../types";
import { CommonPropTypeContainer } from "../commons/CommonPropTypeContainer";
import { Label } from "../commons/Label";
import { PropertyContainer } from "../commons/PropertyContainer";

export const Map: React.FC<ComponentProps> = (props) => {
  const attributes = useMemo(() => {
    return props.attributes || [];
  }, [props]);
  const { routes } = usePageRoutes();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PropertyContainer>
        <Label name={props.propName} />
      </PropertyContainer>
      {attributes.map((attribute, index) => {
        return (
          <CommonPropTypeContainer
            {...props}
            selector={[props.propName, attribute.fieldName]}
            options={attribute.options}
            propType={attribute.type}
            propName={attribute.fieldName}
            key={attribute.fieldName}
            routes={routes}
          />
        );
      })}
    </div>
  );
};
