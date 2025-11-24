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

import { Box, Text } from "@mantine/core";
import type { ModalState } from "./common";
import { SaveCancelModal, TorrentLabels, TorrentsNames } from "./common";
import React, { useCallback, useEffect, useState } from "react";
import { useMutateTorrent } from "queries";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {
  useServerRpcVersion,
  useServerSelectedTorrents,
  useServerTorrentData,
} from "rpc/torrent";

export function EditLabelsModal(props: ModalState) {
  const { t } = useTranslation();
  const { opened, close } = props;
  const serverData = useServerTorrentData();
  const serverSelected = useServerSelectedTorrents();
  const rpcVersion = useServerRpcVersion();
  const [labels, setLabels] = useState<string[]>([]);

  const calculateInitialLabels = useCallback(() => {
    const selected =
      serverData.torrents.filter((t) => serverSelected.has(t.id)) ?? [];
    const labels: string[] = [];
    selected.forEach((t) =>
      t.labels?.forEach((l: string) => {
        if (!labels.includes(l)) labels.push(l);
      })
    );
    return labels;
  }, [serverData.torrents, serverSelected]);

  useEffect(() => {
    if (opened) setLabels(calculateInitialLabels());
  }, [calculateInitialLabels, opened]);

  const { mutate } = useMutateTorrent();

  const onSave = useCallback(() => {
    if (rpcVersion < 16) {
      notifications.show({
        title: t("modals.edit_labels.error_title"),
        message: t("modals.edit_labels.error_version"),
        color: "red",
      });
      close();
      return;
    }
    mutate(
      {
        torrentIds: Array.from(serverSelected),
        fields: { labels },
      },
      {
        onSuccess: () => {
          notifications.show({
            message: t("modals.edit_labels.success_message"),
            color: "green",
          });
        },
        onError: (error) => {
          notifications.show({
            title: t("modals.edit_labels.error_update"),
            message: String(error),
            color: "red",
          });
        },
      }
    );
    close();
  }, [rpcVersion, mutate, serverSelected, labels, close, t]);

  return (
    <>
      {props.opened && (
        <SaveCancelModal
          opened={props.opened}
          size="lg"
          onClose={props.close}
          onSave={onSave}
          centered
          title={t("modals.edit_labels.title")}
        >
          {rpcVersion < 16 ? (
            <Text color="red" fz="lg">
              {t("modals.edit_labels.error_version")}
            </Text>
          ) : (
            <>
              <Text mb="md">{t("modals.edit_labels.enter_new_labels")}</Text>
              <TorrentsNames />
            </>
          )}
          <Box mih="17rem">
            <TorrentLabels
              labels={labels}
              setLabels={setLabels}
              disabled={rpcVersion < 16}
              initiallyOpened
            />
          </Box>
        </SaveCancelModal>
      )}
    </>
  );
}
