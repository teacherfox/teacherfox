import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField as MuiTextField, Box } from "@/configs/mui";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ContactFormStyled } from "./styles";
import { TFButtonPrimary } from "@/elements/TFButton";
import { styled } from "@/configs/mui";
import { Colors } from "@/configs/theme";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    fullName: yup
      .string()
      .required()
      .matches(
        /^(?:([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)) (?:([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*))$/g,
        "Please enter your full name."
      ),
    email: yup.string().email().required(),
    phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    message: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const ContactForm = () => {
  //   const { control, handleSubmit } = useForm({
  //     defaultValues: {
  //       fullName: "",
  //       email: "",
  //       phone: "",
  //       message: "",
  //     },
  //   });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: any) => console.log(data);

  React.useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  //   const TextField = styled(MuiTextField)`
  //   .MuiFormHelperText-root.Mui-error {
  //     color: red;
  //   }
  // `;

  const TextField = styled(MuiTextField)`
    label.Mui-focused {
      color: ${Colors.primary.main}; // color for the label when focused
    }
    .MuiOutlinedInput-root {
      fieldset {
        border-color: ${Colors.background.dark}; // color for the outline
      }
      &.Mui-focused fieldset {
        border-color: ${Colors.primary.main}; // color for the outline when focused
      }
    }
    .MuiFormHelperText-root.Mui-error {
      color: red; // color for the helperText when error
    }
  `;

  return (
    <ContactFormStyled onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <TextField
              {...field}
              variant="outlined"
              label="Ονοματεπώνυμο"
              fullWidth
              //   helperText={errors.fullName ? errors.fullName.message : null}
            />
            <p style={{ marginTop: "0px", marginBottom: "0px" }}>
              {errors.fullName ? errors.fullName.message : null}
            </p>
          </Box>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <TextField
              {...field}
              variant="outlined"
              label="Email"
              // helperText={errors.email ? errors.email.message : null}
              fullWidth
            />
            <p style={{ marginTop: "0px", marginBottom: "0px" }}>
              {errors.email ? errors.email.message : null}
            </p>
          </Box>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <TextField
              {...field}
              variant="outlined"
              label="Τηλεφωνο"
              // helperText={errors.phone ? errors.phone.message : null}
              fullWidth
            />
            <p style={{ marginTop: "0px", marginBottom: "0px" }}>
              {errors.phone ? errors.phone.message : null}
            </p>
          </Box>
        )}
      />
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <TextField
              {...field}
              variant="outlined"
              label="Το μήνυμά σας"
              // helperText={errors.message ? errors.message.message : null}
              fullWidth
              multiline
              maxRows={4}
            />
            <p style={{ marginTop: "0px", marginBottom: "0px" }}>
              {errors.message ? errors.message.message : null}
            </p>
          </Box>
        )}
      />
      <TFButtonPrimary type="submit">Αποστολή</TFButtonPrimary>
    </ContactFormStyled>
  );
};

export default ContactForm;
