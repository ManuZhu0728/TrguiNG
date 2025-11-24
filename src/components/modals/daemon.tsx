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

import type { NumberInputProps } from "@mantine/core";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  HoverCard,
  Loader,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  SegmentedControl,
  Stack,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import type { ServerConfig } from "config";
import { ConfigContext, ServerConfigContext } from "config";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ModalState } from "./common";
import { SaveCancelModal } from "./common";
import {
  queryClient,
  useMutateSession,
  useSessionFull,
  useTestPort,
  useUpdateBlocklist,
} from "queries";
import type { UseFormReturnType } from "@mantine/form";
import { useForm } from "@mantine/form";
import type { SessionInfo } from "rpc/client";
import type { ExtendedCustomColors } from "types/mantine";
import type { BandwidthGroup } from "rpc/torrent";
import { notifications } from "@mantine/notifications";
import type { InterfaceFormValues } from "./interfacepanel";
import { InterfaceSettigsPanel } from "./interfacepanel";
import { useTranslation } from "react-i18next";
import * as Icon from "react-bootstrap-icons";
const { TAURI } = await import(/* webpackChunkName: "taurishim" */ "taurishim");

interface FormValues extends InterfaceFormValues {
  intervals: ServerConfig["intervals"];
  session?: SessionInfo;
  bandwidthGroups?: BandwidthGroup[];
}

function PollingPanel({ form }: { form: UseFormReturnType<FormValues> }) {
  const { t } = useTranslation();
  return (
    <Grid align="center">
      <Grid.Col>
        <Text>{t("modals.daemon.update_intervals")}</Text>
      </Grid.Col>
      <Grid.Col span={8}>{t("modals.daemon.session")}</Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={1}
          max={3600}
          {...form.getInputProps("intervals.session")}
        />
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={8}>{t("modals.daemon.torrent_details")}</Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={1}
          max={3600}
          {...form.getInputProps("intervals.details")}
        />
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={8}>{t("modals.daemon.torrents_active")}</Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={1}
          max={3600}
          {...form.getInputProps("intervals.torrents")}
        />
      </Grid.Col>
      <Grid.Col span={2} />
      <Grid.Col span={8}>{t("modals.daemon.torrents_inactive")}</Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={1}
          max={3600}
          {...form.getInputProps("intervals.torrentsMinimized")}
        />
      </Grid.Col>
      <Grid.Col span={2} />
    </Grid>
  );
}

function DownloadPanel({
  form,
  session,
}: {
  form: UseFormReturnType<FormValues>;
  session: SessionInfo;
}) {
  const { t } = useTranslation();
  return (
    <Grid align="center">
      <Grid.Col>
        <TextInput
          label={t("modals.daemon.default_download_folder")}
          {...form.getInputProps("session.download-dir")}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={
            <Box>
              <span>{t("modals.daemon.start_added_torrents")}</span>
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Icon.Question />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">
                    {t("modals.daemon.start_added_torrents_tooltip")}
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Box>
          }
          {...form.getInputProps("session.start-added-torrents", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.add_part_extension")}
          {...form.getInputProps("session.rename-partial-files", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.use_incomplete_dir")}
          {...form.getInputProps("session.incomplete-dir-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col>
        <TextInput
          label={t("modals.daemon.incomplete_dir_path")}
          {...form.getInputProps("session.incomplete-dir")}
          disabled={session["incomplete-dir-enabled"] !== true}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label={t("modals.daemon.use_default_seed_ratio")}
          {...form.getInputProps("session.seedRatioLimited", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={0}
          precision={2}
          step={0.05}
          {...form.getInputProps("session.seedRatioLimit")}
          disabled={session.seedRatioLimited !== true}
        />
      </Grid.Col>
      <Grid.Col span={4}></Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label={t("modals.daemon.stop_idle_torrents")}
          {...form.getInputProps("session.idle-seeding-limit-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.idle-seeding-limit")}
          disabled={session["idle-seeding-limit-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={4}>{t("modals.daemon.minutes")}</Grid.Col>
      <Grid.Col span={6}>{t("modals.daemon.disk_cache_size")}</Grid.Col>
      <Grid.Col span={2}>
        <NumberInput min={0} {...form.getInputProps("session.cache-size-mb")} />
      </Grid.Col>
      <Grid.Col span={4}>{t("modals.daemon.mb")}</Grid.Col>
    </Grid>
  );
}

interface PortTestResult {
  label: string;
  color: ExtendedCustomColors;
}

function NetworkPanel({
  opened,
  form,
  session,
}: {
  opened: boolean;
  form: UseFormReturnType<FormValues>;
  session: SessionInfo;
}) {
  const { t } = useTranslation();
  const [testPortQueryEnbaled, setTestPortQueryEnabled] = useState(false);
  const [testPortResult, setTestPortResult] = useState<PortTestResult>({
    label: "",
    color: "green",
  });

  const {
    data: testPort,
    status,
    fetchStatus,
    remove: removeQuery,
  } = useTestPort(testPortQueryEnbaled);

  const onTestPort = useCallback(() => {
    setTestPortQueryEnabled(true);
  }, [setTestPortQueryEnabled]);

  useEffect(() => {
    if (fetchStatus !== "fetching") {
      setTestPortQueryEnabled(false);
    }
    if (status === "success") {
      setTestPortResult(
        testPort.arguments["port-is-open"] === true
          ? {
              label: t("modals.daemon.port_is_open"),
              color: "green",
            }
          : {
              label: t("modals.daemon.port_unreachable"),
              color: "red",
            }
      );
    } else if (status === "loading") {
      setTestPortResult({
        label: "",
        color: "green",
      });
    } else {
      setTestPortResult({
        label: t("modals.daemon.api_error"),
        color: "red",
      });
    }
  }, [fetchStatus, status, testPort, t]);

  useEffect(() => {
    if (!opened) {
      setTestPortResult({
        label: "",
        color: "green",
      });
      removeQuery();
    }
  }, [opened, setTestPortResult, removeQuery]);

  const { mutate: updateBlocklist, isLoading: updatePending } =
    useUpdateBlocklist();
  const onUpdateBlocklist = useCallback(() => {
    updateBlocklist(undefined, {
      onError: (e) => {
        console.log(e);
        notifications.show({
          title: t("modals.daemon.error_updating_blocklist"),
          message: e.message,
          color: "red",
        });
      },
    });
  }, [updateBlocklist, t]);

  return (
    <Grid align="center">
      <Grid.Col span={3}>{t("modals.daemon.incoming_port")}</Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={1}
          max={65535}
          {...form.getInputProps("session.peer-port")}
          disabled={session["peer-port-random-on-start"] === true}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Tooltip withArrow label={t("modals.daemon.test_port_tooltip")}>
          <Button
            w="100%"
            onClick={onTestPort}
            title={t("modals.daemon.test_port")}
          >
            {t("modals.daemon.test_port")}
          </Button>
        </Tooltip>
      </Grid.Col>
      <Grid.Col span={3}>
        {fetchStatus === "fetching" ? (
          <Loader key="pt" size="1.5rem" />
        ) : (
          <Text key="pt" color={testPortResult.color}>
            {testPortResult.label}
          </Text>
        )}
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.random_port_on_start")}
          {...form.getInputProps("session.peer-port-random-on-start", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.enable_upnp")}
          {...form.getInputProps("session.port-forwarding-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={3}>{t("modals.daemon.encryption")}</Grid.Col>
      <Grid.Col span={3}>
        <NativeSelect
          data={["tolerated", "preferred", "required"]}
          {...form.getInputProps("session.encryption")}
        />
      </Grid.Col>
      <Grid.Col span={6}></Grid.Col>
      <Grid.Col span={3}>{t("modals.daemon.global_peer_limit")}</Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.peer-limit-global")}
        />
      </Grid.Col>
      <Grid.Col span={3}>{t("modals.daemon.per_torrent_peer_limit")}</Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.peer-limit-per-torrent")}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.enable_pex")}
          {...form.getInputProps("session.pex-enabled", { type: "checkbox" })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.enable_dht")}
          {...form.getInputProps("session.dht-enabled", { type: "checkbox" })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          my="lg"
          label={t("modals.daemon.enable_lpd")}
          {...form.getInputProps("session.lpd-enabled", { type: "checkbox" })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          my="lg"
          label={t("modals.daemon.enable_utp")}
          {...form.getInputProps("session.utp-enabled", { type: "checkbox" })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label={t("modals.daemon.enable_blocklist")}
          {...form.getInputProps("session.blocklist-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          {...form.getInputProps("session.blocklist-url")}
          disabled={session["blocklist-enabled"] !== true}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Text>
          {t("modals.daemon.blocklist_size", {
            count: session["blocklist-size"] as number,
          })}
        </Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Tooltip withArrow label={t("modals.daemon.update_blocklist_tooltip")}>
          <Button
            w="100%"
            onClick={onUpdateBlocklist}
            title={t("modals.daemon.update_blocklist")}
          >
            {t("modals.daemon.update")}
          </Button>
        </Tooltip>
      </Grid.Col>
      <Grid.Col span={3}>{updatePending && <Loader size="1.5rem" />}</Grid.Col>
    </Grid>
  );
}

function toTimeStr(time: string) {
  const t = parseInt(time);
  return (
    String(Math.floor(t / 60)).padStart(2, "0") +
    ":" +
    String(t % 60).padStart(2, "0")
  );
}

function fromTimeStr(time: string) {
  const parts = time.split(":");
  if (parts.length !== 2) return "";
  const h = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  if (isNaN(h) || isNaN(m)) return "";
  return `${h * 60 + m}`;
}

function TimeInput(props: NumberInputProps) {
  return <NumberInput {...props} parser={fromTimeStr} formatter={toTimeStr} />;
}

const DaysOfTheWeek = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

function DayOfWeekCheckbox({
  form,
  day,
  session,
}: {
  form: UseFormReturnType<FormValues>;
  day: number;
  session: SessionInfo;
}) {
  return (
    <Checkbox
      my="lg"
      label={DaysOfTheWeek[day]}
      checked={((session["alt-speed-time-day"] as number) & (1 << day)) > 0}
      onChange={(event) => {
        const val = session["alt-speed-time-day"] as number;
        form.setFieldValue(
          "session.alt-speed-time-day",
          event.currentTarget.checked ? val | (1 << day) : val & ~(1 << day)
        );
      }}
      disabled={session["alt-speed-time-enabled"] !== true}
    />
  );
}

function BandwidthPanel({
  form,
  session,
}: {
  form: UseFormReturnType<FormValues>;
  session: SessionInfo;
}) {
  const { t } = useTranslation();
  return (
    <Grid align="center">
      <Grid.Col span={6}></Grid.Col>
      <Grid.Col span={3}>{t("modals.daemon.normal")}</Grid.Col>
      <Grid.Col span={3}>{t("modals.daemon.alternate")}</Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label={t("modals.daemon.max_download_speed")}
          {...form.getInputProps("session.speed-limit-down-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.speed-limit-down")}
          disabled={session["speed-limit-down-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.alt-speed-down")}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label={t("modals.daemon.max_upload_speed")}
          {...form.getInputProps("session.speed-limit-up-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.speed-limit-up")}
          disabled={session["speed-limit-up-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput min={0} {...form.getInputProps("session.alt-speed-up")} />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          mt="lg"
          label={t("modals.daemon.use_alt_bandwidth_settings")}
          {...form.getInputProps("session.alt-speed-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          my="lg"
          label={t("modals.daemon.apply_alt_bandwidth_settings_automatically")}
          {...form.getInputProps("session.alt-speed-time-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>{t("modals.daemon.from")}</Grid.Col>
      <Grid.Col span={3}>
        <TimeInput
          min={0}
          max={24 * 60 - 1}
          {...form.getInputProps("session.alt-speed-time-begin")}
          disabled={session["alt-speed-time-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={2}>{t("modals.daemon.to")}</Grid.Col>
      <Grid.Col span={3}>
        <TimeInput
          min={0}
          max={24 * 60 - 1}
          {...form.getInputProps("session.alt-speed-time-end")}
          disabled={session["alt-speed-time-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={2}>{t("modals.daemon.days")}</Grid.Col>
      <Grid.Col span={10}>
        <Group>
          {DaysOfTheWeek.map((_, day) => (
            <DayOfWeekCheckbox
              key={day}
              form={form}
              day={day}
              session={session}
            />
          ))}
        </Group>
      </Grid.Col>
    </Grid>
  );
}

function QueuePanel({
  form,
  session,
}: {
  form: UseFormReturnType<FormValues>;
  session: SessionInfo;
}) {
  const { t } = useTranslation();
  return (
    <Grid align="center">
      <Grid.Col span={8}>
        <Checkbox
          label={t("modals.daemon.download_queue_size")}
          {...form.getInputProps("session.download-queue-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.download-queue-size")}
          disabled={session["download-queue-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={8}>
        <Checkbox
          label={t("modals.daemon.seed_queue_size")}
          {...form.getInputProps("session.seed-queue-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.seed-queue-size")}
          disabled={session["seed-queue-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={8}>
        <Checkbox
          label={t("modals.daemon.consider_torrents_stalled")}
          {...form.getInputProps("session.queue-stalled-enabled", {
            type: "checkbox",
          })}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberInput
          min={0}
          {...form.getInputProps("session.queue-stalled-minutes")}
          disabled={session["queue-stalled-enabled"] !== true}
        />
      </Grid.Col>
      <Grid.Col span={2}>{t("modals.daemon.minutes")}</Grid.Col>
    </Grid>
  );
}

async function isMagnetHandler() {
  return false;
}

async function registerMagnetHandler() {
  if (TAURI) {
    const { invoke } = await import("taurishim");
    await invoke("app_integration", { mode: "magnet" });
  }
}

function MagnetHandlerPanel() {
  const { t } = useTranslation();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    (async () => {
      setIsRegistered(await isMagnetHandler());
    })();
  }, []);

  return (
    <Stack>
      <Text>{t("modals.daemon.magnet_handler_desc")}</Text>
      <Button
        disabled={isRegistered}
        onClick={async () => {
          await registerMagnetHandler();
          setIsRegistered(await isMagnetHandler());
        }}
      >
        {isRegistered
          ? t("modals.daemon.magnet_handler_registered")
          : t("modals.daemon.register_magnet_handler")}
      </Button>
    </Stack>
  );
}

export function DaemonSettingsModal(props: ModalState) {
  const { data: session, fetchStatus } = useSessionFull(props.opened);
  const mutation = useMutateSession();
  const config = useContext(ConfigContext);
  const serverConfig = useContext(ServerConfigContext);
  const { t, i18n } = useTranslation();

  const form = useForm<FormValues>({
    initialValues: {
      intervals: serverConfig.intervals,
      session,
      interface: config.values.interface,
    },
  });

  const { setFieldValue } = form;
  useEffect(() => {
    setFieldValue("session", session);
  }, [session, setFieldValue]);

  useEffect(() => {
    if (props.opened) {
      setFieldValue("interface", config.values.interface);
    }
  }, [config, props.opened, setFieldValue]);

  const onSave = useCallback(() => {
    serverConfig.intervals = { ...form.values.intervals };
    config.values.interface = {
      ...config.values.interface,
      ...form.values.interface,
    };
    config.cleanup();
    void config.save();
    if (form.values.session !== undefined) {
      mutation.mutate(form.values.session, {
        onSuccess: () => {
          notifications.show({
            message: t("modals.daemon.notifications.saved"),
            color: "green",
          });
          props.close();
          if (!TAURI) {
            // clear client cache to make sure new interface settings are applied
            queryClient.clear();
          }
        },
        onError: (error) => {
          notifications.show({
            title: t("modals.daemon.notifications.failed"),
            message: String(error),
            color: "red",
          });
        },
      });
    } else {
      props.close();
    }
  }, [form.values, mutation, props, config, serverConfig, t]);

  return (
    <SaveCancelModal
      opened={props.opened}
      size="lg"
      onClose={props.close}
      onSave={onSave}
      saveLoading={mutation.isLoading}
      centered
      title={t("modals.daemon.title")}
    >
      <Box pos="relative">
        <LoadingOverlay visible={fetchStatus === "fetching"} overlayBlur={2} />
        <Tabs defaultValue="polling" mih="33rem">
          <Tabs.List>
            <Tabs.Tab value="polling" p="lg">
              {t("modals.daemon.tabs.polling")}
            </Tabs.Tab>
            <Tabs.Tab value="download" p="lg">
              {t("modals.daemon.tabs.download")}
            </Tabs.Tab>
            <Tabs.Tab value="network" p="lg">
              {t("modals.daemon.tabs.network")}
            </Tabs.Tab>
            <Tabs.Tab value="bandwidth" p="lg">
              {t("modals.daemon.tabs.bandwidth")}
            </Tabs.Tab>
            <Tabs.Tab value="queue" p="lg">
              {t("modals.daemon.tabs.queue")}
            </Tabs.Tab>
            {!TAURI && (
              <>
                <Tabs.Tab value="interface" p="lg">
                  {t("modals.daemon.tabs.interface")}
                </Tabs.Tab>
                <Tabs.Tab value="magnethandler" p="lg">
                  {t("modals.daemon.tabs.magnethandler")}
                </Tabs.Tab>
              </>
            )}
          </Tabs.List>
          {form.values.session !== undefined ? (
            <>
              <Tabs.Panel value="polling" p="lg">
                <PollingPanel form={form} />
              </Tabs.Panel>

              <Tabs.Panel value="download" p="lg">
                <DownloadPanel form={form} session={form.values.session} />
              </Tabs.Panel>

              <Tabs.Panel value="network" p="lg">
                <NetworkPanel
                  opened={props.opened}
                  form={form}
                  session={form.values.session}
                />
              </Tabs.Panel>

              <Tabs.Panel value="bandwidth" p="lg">
                <BandwidthPanel form={form} session={form.values.session} />
              </Tabs.Panel>

              <Tabs.Panel value="queue" p="lg">
                <QueuePanel form={form} session={form.values.session} />
              </Tabs.Panel>

              {!TAURI && (
                <>
                  <Tabs.Panel value="interface" p="lg">
                    <InterfaceSettigsPanel form={form} />
                  </Tabs.Panel>
                  <Tabs.Panel value="magnethandler" p="lg">
                    <MagnetHandlerPanel />
                  </Tabs.Panel>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </Tabs>
        {!TAURI && (
          <Group position="apart" mt="md">
            <Text>{t("modals.daemon.language")}</Text>
            <SegmentedControl
              value={i18n.language ?? "en"}
              onChange={(value: string) => {
                void i18n.changeLanguage(value);
              }}
              data={[
                { label: "English", value: "en" },
                { label: "中文", value: "zh" },
              ]}
            />
          </Group>
        )}
      </Box>
    </SaveCancelModal>
  );
}
