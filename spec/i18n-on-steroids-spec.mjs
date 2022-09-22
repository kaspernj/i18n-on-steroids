import I18nOnSteroids from "../index.mjs"
import RaiseInBackground from "../src/error-handlers/raise-in-background.mjs"

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
  it("translates from the loaded files", () => {
    const helloWorld = i18n.t("hello_world")

    expect(helloWorld).toEqual("Hej verden")
  })

  it("raises an error when the translation couldnt be found", () => {
    expect(() => { i18n.t("non_existent_key") }).toThrowError("Key didn't exist: da.non_existent_key")
  })

  it("raises an error in the background when a key doesnt exist", () => {
    const raiseInBackground = new RaiseInBackground()
    const oldErrorHandler = i18n.errorHandler

    i18n.setErrorHandler(raiseInBackground)

    spyOn(global, "setTimeout").and.callFake((something, time) => {
      expect(time).toEqual(0)
      expect(() => something()).toThrow(new Error("Key didn't exist: da.non_existent_key"))
    })

    try {
      expect(i18n.t("non_existent_key")).toEqual("non_existent_key")
    } finally {
      i18n.setErrorHandler(oldErrorHandler)
    }
  })

  it("accepts a default value", () => {
    const helloWorld = i18n.t("hello_world_that_doesnt_exist", {defaultValue: "Hallo Welt %{number}", number: 5})

    expect(helloWorld).toEqual("Hallo Welt 5")
  })
})
