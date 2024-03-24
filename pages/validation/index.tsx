import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  CssBaseline,
  Container,
  FormHelperText,
  Box,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import "@/app/globals.css";
import Typography from "@mui/material/Typography";

interface IFormInput {
  name: string;
  gender: string;
  occupation: string;
}

export default function ValidationPage() {
  /**
   * useFormでフォームの状態管理を行う
   * 標準HTMLフォームのinputやselectを使う場合はregisterを使う
   * MUIの場合はcontrolとControllerをセットで使う。これによりReact hook FormとMUIを統合できる
   */
  const {
    control, // Controllerで使うオブジェクト
    handleSubmit, // フォーム送信時のイベントハンドラ、エラーがない場合のみsubmitが実行される
    watch, // 指定したフィールドの値の変更を監視し、その値を取得できる
    formState: { errors }, // フィールドごとのエラーメッセージやエラータイプを保持する
  } = useForm<IFormInput>({ mode: "onBlur" }); // バリデーションモード

  /**
   * フォーム送信時に実行されるコールバック関数
   */
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("RESULT", data);
    alert(JSON.stringify(data));
  };

  /**
   * フォームの全フィールドの現在の値を監視し、その値を取得する。
   * この値はリアルタイムで更新される。
   */
  const watchFields = watch();

  return (
    <Container>
      <CssBaseline />
      <Typography variant="h4">
        React Hook Form × MUIのフォームバリデーションの実装
      </Typography>
      <Box display={"flex"} flexDirection={"row"}>
        <Box flex={1} p={3}>
          {/* 名前入力 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: "Name is required",
                maxLength: {
                  value: 10,
                  message: "Name must be 10 characters or less",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  error={Boolean(errors.name)}
                  helperText={errors.name ? errors.name.message : ""}
                  fullWidth
                  margin="normal"
                  size="small"
                  required={true}
                />
              )}
            />
            {/* 性別選択 */}
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Gender *</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <FormHelperText style={{ color: "red" }}>
                  {errors.gender.message}
                </FormHelperText>
              )}
            </FormControl>

            {/* 職業選択 */}
            <FormControl fullWidth margin="normal">
              <FormLabel component="legend">Occupation *</FormLabel>
              <Controller
                name="occupation"
                control={control}
                defaultValue=""
                // カスタムルール。空文字列（Noneが選択された）場合はエラーメッセージを返す
                rules={{
                  validate: (value) => value !== "" || "Occupation is required",
                }}
                render={({ field }) => (
                  <Select {...field} displayEmpty size="small" required={true}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                )}
              />{" "}
              {errors.occupation && (
                <FormHelperText style={{ color: "red" }}>
                  {errors.occupation.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="mt-10"
            >
              Submit
            </Button>
          </form>
        </Box>

        {/* 現在のステートを表示 */}
        <Box flex={1} p={3} style={{ backgroundColor: "#f0f0f0" }}>
          <h2>Watch</h2>
          <pre>{JSON.stringify(watchFields, null, 2)}</pre>
        </Box>

        {/* エラーメッセージとタッチされたフィールドを表示 */}
        <Box flex={1} p={3} style={{ backgroundColor: "#f0e0e0" }}>
          <h2>Errors</h2>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </Box>
      </Box>
    </Container>
  );
}
