/**
 * TrguiNG - next gen remote GUI for transmission torrent daemon
 * Copyright (C) 2023  qu1ck (mail at qu1ck.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useCallback, useEffect, useState } from "react";
import type { ColorScheme } from "@mantine/core";
import {
  Box,
  Checkbox,
  Grid,
  HoverCard,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Tabs,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import ColorChooser from "components/colorchooser";
import { useGlobalStyleOverrides } from "themehooks";
import {
  AddTorrentPriorityOptions,
  AddTorrentStartOptions,
  DateFormatOptions,
  DeleteTorrentDataOptions,
  TimeFormatOptions,
} from "config";
import type {
  AddTorrentPriorityOption,
  AddTorrentStartOption,
  ColorSetting,
  DateFormatOption,
  DeleteTorrentDataOption,
  StyleOverrides,
  TimeFormatOption,
} from "config";
import { ColorSchemeToggle } from "components/miscbuttons";
import { Label } from "./common";
import * as Icon from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
const { TAURI, invoke } = await import(
  /* webpackChunkName: "taurishim" */ "taurishim"
);

export interface InterfaceFormValues {
  interface: {
    theme?: ColorScheme;
    styleOverrides: StyleOverrides;
    skipAddDialog: boolean;
    addTorrentStart: AddTorrentStartOption;
    addTorrentPriority: AddTorrentPriorityOption;
    deleteTorrentData: DeleteTorrentDataOption;
    animatedProgressbars: boolean;
    colorfulProgressbars: boolean;
    numLastSaveDirs: number;
    sortLastSaveDirs: boolean;
    preconfiguredLabels: string[];
    preconfiguredDirs: string[];
    ignoredTrackerPrefixes: string[];
    defaultTrackers: string[];
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
    dateFormat: DateFormatOption;
    timeFormat: TimeFormatOption;
  };
}

export function InterfaceSettigsPanel<V extends InterfaceFormValues>(props: {
  form: UseFormReturnType<V>;
}) {
  const theme = useMantineTheme();
  const { t, i18n } = useTranslation();
  const { style, setStyle } = useGlobalStyleOverrides();
  const [systemFonts, setSystemFonts] = useState<string[]>(["Default"]);

  useEffect(() => {
    if (TAURI) {
      invoke<string[]>("list_system_fonts")
        .then((fonts) => {
          fonts.sort();
          setSystemFonts(["Default"].concat(fonts));
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        .catch(console.error);
    } else {
      setSystemFonts(["Default", "Arial", "Verdana", "Tahoma", "Roboto"]);
    }
  }, []);

  const { setFieldValue, setFieldError, clearFieldError } =
    props.form as unknown as UseFormReturnType<InterfaceFormValues>;

              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue("interface.theme", theme.colorScheme);
  }, [setFieldValue, theme]);

  const setTextColor = useCallback(
    (color: ColorSetting | undefined) => {
      const newStyle = {
        dark: { ...style.dark },
        light: { ...style.light },
        font: style.font,
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      newStyle[theme.colorScheme].color = color;
      setStyle(newStyle);
      setFieldValue("interface.styleOverrides", newStyle);
    },
    [style, theme.colorScheme, setStyle, setFieldValue]
  );

  const setBgColor = useCallback(
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStyle = {
        dark: { ...style.dark },
        light: { ...style.light },
        font: style.font,
      };
      newStyle[theme.colorScheme].backgroundColor = backgroundColor;
      setStyle(newStyle);
      setFieldValue("interface.styleOverrides", newStyle);
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
    [style, theme.colorScheme, setStyle, setFieldValue]
  );

  const setFont = useCallback(
    (font: string) => {
      const newStyle = {
        dark: { ...style.dark },
        light: { ...style.light },
        font: font === "Default" ? undefined : font,
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setStyle(newStyle);
      setFieldValue("interface.styleOverrides", newStyle);
    },
    [style, setStyle, setFieldValue]
  );

  const defaultColor =
    theme.colorScheme === "dark"
      ? { color: "dark", shade: 0, computed: theme.colors.dark[0] }
      : { color: "dark", shade: 9, computed: theme.colors.dark[9] };

  const defaultBg =
    theme.colorScheme === "dark"
      ? { color: "dark", shade: 7, computed: theme.colors.dark[7] }
      : { color: "gray", shade: 0, computed: theme.colors.gray[0] };

  const setPreconfiguredLabels = useCallback(
    (labels: string[]) => {
      setFieldValue("interface.preconfiguredLabels", labels);
    },
    [setFieldValue]
  );

  const setIgnoredTrackerPrefixes = useCallback(
    (prefixes: string[]) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new RegExp(
          `^(?<prefix>(${prefixes.join("|")})\\d*)\\.[^.]+\\.[^.]+$`,
          "i"
        );
        setFieldValue("interface.ignoredTrackerPrefixes", prefixes);
        clearFieldError("interface.ignoredTrackerPrefixes");
      } catch {
        setFieldError(
          "interface.ignoredTrackerPrefixes",
          t("interface.misc.invalidRegex")
        );
      }
    },
    [setFieldValue, setFieldError, clearFieldError, t]
  );

  return (
    <Tabs defaultValue="appearance" orientation="vertical" mih="29rem">
      <Tabs.List>
        <Tabs.Tab value="appearance" p="lg">
          {t("interface.tabs.appearance")}
        </Tabs.Tab>
        <Tabs.Tab value="downloads" p="lg">
          {t("interface.tabs.downloads")}
        </Tabs.Tab>
        <Tabs.Tab value="miscellaneous" p="lg">
          {t("interface.tabs.miscellaneous")}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="appearance" p="lg">
        <Grid align="center">
          <Grid.Col span={6}>{t("interface.appearance.theme")}</Grid.Col>
          <Grid.Col span={6}>
            <ColorSchemeToggle />
          </Grid.Col>
          <Grid.Col span={6}>{t("interface.appearance.font")}</Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={systemFonts}
              value={style.font}
              onChange={(e) => {
                setFont(e.currentTarget.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>{t("interface.appearance.language")}</Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={
                i18n.options.supportedLngs
                  ?.filter((l) => typeof l === "string" && l !== "cimode")
                  .map((lng) => ({
                    label:
                      lng === "en" ? "English" : lng === "zh" ? "中文" : lng,
                    value: lng as string,
                  })) ?? [
                  { label: "English", value: "en" },
                  { label: "中文", value: "zh" },
                ]
              }
              value={i18n.language ?? i18n.resolvedLanguage ?? "en"}
              onChange={(e) => {
                void i18n.changeLanguage(e.currentTarget.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>{t("interface.appearance.textColor")}</Grid.Col>
          <Grid.Col span={6}>
            <ColorChooser
              value={style[theme.colorScheme].color ?? defaultColor}
              onChange={setTextColor}
            />
          </Grid.Col>
          <Grid.Col span={6}>{t("interface.appearance.background")}</Grid.Col>
          <Grid.Col span={6}>
            <ColorChooser
              value={style[theme.colorScheme].backgroundColor ?? defaultBg}
              onChange={setBgColor}
            />
          </Grid.Col>
          <Grid.Col span={6}>{t("interface.appearance.progressBars")}</Grid.Col>
          <Grid.Col span={3}>
            <Checkbox
              label={t("interface.appearance.progressBars.colorful")}
              {...props.form.getInputProps("interface.colorfulProgressbars", {
                type: "checkbox",
              })}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Checkbox
              label={t("interface.appearance.progressBars.animated")}
              {...props.form.getInputProps("interface.animatedProgressbars", {
                type: "checkbox",
              })}
            />
          </Grid.Col>
          <Grid.Col>
            <Checkbox
              label={t("interface.appearance.customDateTime")}
              mt="lg"
              {...props.form.getInputProps(
                "interface.useCustomDateTimeFormat",
                { type: "checkbox" }
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={[...DateFormatOptions]}
              disabled={!props.form.values.interface.useCustomDateTimeFormat}
              value={props.form.values.interface.dateFormat}
              onChange={(e) => {
                setFieldValue("interface.dateFormat", e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={[...TimeFormatOptions]}
              disabled={!props.form.values.interface.useCustomDateTimeFormat}
              value={props.form.values.interface.timeFormat}
              onChange={(e) => {
                setFieldValue("interface.timeFormat", e.target.value);
              }}
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>
      <Tabs.Panel value="downloads" p="lg">
        <Grid align="center">
          <Grid.Col>
            <Checkbox
              label={t("interface.downloads.skipAddDialog")}
              {...props.form.getInputProps("interface.skipAddDialog", {
                type: "checkbox",
              })}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            {t("interface.downloads.newTorrentStart")}
          </Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={AddTorrentStartOptions as unknown as string[]}
              value={props.form.values.interface.addTorrentStart}
              onChange={(e) => {
                setFieldValue("interface.addTorrentStart", e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            {t("interface.downloads.newTorrentPriority")}
          </Grid.Col>
          <Grid.Col span={6}>
            <NativeSelect
              data={AddTorrentPriorityOptions as unknown as string[]}
              value={props.form.values.interface.addTorrentPriority}
              onChange={(e) => {
                setFieldValue("interface.addTorrentPriority", e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col>
            <Checkbox
              label={t("interface.downloads.sortSaveDirs")}
              my="lg"
              {...props.form.getInputProps("interface.sortLastSaveDirs", {
                type: "checkbox",
              })}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            {t("interface.downloads.maxSaveDirs")}
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              min={1}
              max={100}
              {...props.form.getInputProps("interface.numLastSaveDirs")}
            />
          </Grid.Col>
          <Grid.Col>
            <Textarea
              minRows={6}
              label={t("interface.downloads.preconfiguredDirs")}
              value={props.form.values.interface.preconfiguredDirs.join("\n")}
              onChange={(e) => {
                props.form.setFieldValue(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  "interface.preconfiguredDirs",
                  e.currentTarget.value.split("\n") as any
                );
              }}
            />
          </Grid.Col>
          <Grid.Col>
            <MultiSelect
              data={props.form.values.interface.preconfiguredLabels}
              value={props.form.values.interface.preconfiguredLabels}
              onChange={setPreconfiguredLabels}
              label={
                <Box>
                  <span>{t("interface.downloads.preconfiguredLabels")}</span>
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                      <Icon.Question />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="sm">
                        {t("interface.downloads.preconfiguredLabels.help")}
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Box>
              }
              withinPortal
              searchable
              creatable
                getCreateLabel={(query: string) =>
                t("interface.downloads.preconfiguredLabels.add", {
                  label: query,
                })
              }
                onCreate={(query: string) => {
                setPreconfiguredLabels([
                  ...props.form.values.interface.preconfiguredLabels,
                  query,
                ]);
                return query;
              }}
              valueComponent={Label}
            />
          </Grid.Col>
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      </Tabs.Panel>
      <Tabs.Panel value="miscellaneous" p="lg">
        <Grid align="center">
          <Grid.Col span={8}>
            {t("interface.misc.deleteDataOption")}
          </Grid.Col>
          <Grid.Col span={4}>
            <NativeSelect
              data={DeleteTorrentDataOptions as unknown as string[]}
              value={props.form.values.interface.deleteTorrentData}
              onChange={(e) => {
                setFieldValue("interface.deleteTorrentData", e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col>
            <MultiSelect
              data={props.form.values.interface.ignoredTrackerPrefixes}
              value={props.form.values.interface.ignoredTrackerPrefixes}
              onChange={setIgnoredTrackerPrefixes}
              label={
                <Box>
                  <span>{t("interface.misc.ignoredTrackerPrefixes")}</span>
                  <HoverCard width={380} shadow="md">
                    <HoverCard.Target>
                      <Icon.Question />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="sm">
                        {t("interface.misc.ignoredTrackerPrefixes.help")}
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Box>
              }
              withinPortal
              searchable
              creatable
              error={props.form.errors["interface.ignoredTrackerPrefixes"]}
              getCreateLabel={(query) =>
                t("interface.misc.ignoredTrackerPrefixes.add", {
                  label: query,
                })
              }
              onCreate={(query) => {
                setIgnoredTrackerPrefixes([
                  ...props.form.values.interface.ignoredTrackerPrefixes,
                  query,
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                return query;
              }}
              valueComponent={Label}
            />
          </Grid.Col>
          <Grid.Col>
            <Textarea
              minRows={6}
              label={t("interface.misc.defaultTrackers")}
              value={props.form.values.interface.defaultTrackers.join("\n")}
              onChange={(e) => {
                props.form.setFieldValue(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  "interface.defaultTrackers",
                  e.currentTarget.value.split("\n") as any
                );
              }}
            />
          </Grid.Col>
        </Grid>
      </Tabs.Panel>
    </Tabs>
  );
}
