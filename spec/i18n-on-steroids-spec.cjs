const I18nOnSteroids = require("../index.cjs")
const i18n = new I18nOnSteroids()

i18n.scanObject({
  da: {
    hello_world: "Hej verden"
  },
  en: {
    hello_world: "Hello world"
  }
})
i18n.setLocale("da")

describe("I18nOnSteroids", () => {
  it("it translates from the loaded files", () => {
    const helloWorld = i18n.t("hello_world")

    expect(helloWorld).toEqual("Hej verden")
  })

  it("it raises an error when the translation couldnt be found", () => {
    expect(() => { i18n.t("non_existent_key") }).toThrowError("Path didn't exist: da.non_existent_key")
  })
})
