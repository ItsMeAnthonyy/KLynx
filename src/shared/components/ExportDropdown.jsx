import { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import Button from "./Button";
import styles from './ExportDropdown.module.css';


export default function ExportDropdown({
    title = "Export",
    icon,
    sections = [],
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
    }, []);

    const handleAction = async (action) => {
        if (action.loading) return;

        setOpen(false);

        if (action.onClick) {
            await action.onClick();
        }
    };

    return (
        <div
            className={styles.container}
            ref={dropdownRef}
        >
            <Button
                variant="secondary"
                icon={
                    <>
                        {icon}
                        <BiChevronDown
                            className={`${styles.chevron} ${
                                open ? styles.rotate : ""
                            }`}
                            size={18}
                        />
                    </>
                }
                onClick={() => setOpen((prev) => !prev)}
                disabled={disabled}
            >
                {title}
            </Button>

            {open && (
                <div className={styles.dropdown}>
                    {sections.map((section, sectionIndex) => (
                        <div
                            key={sectionIndex}
                        >
                            <div className={styles.sectionTitle}>
                                {section.title}
                            </div>

                            {section.items.map(
                                (item, itemIndex) => (
                                    <button
                                        key={itemIndex}
                                        className={styles.item}
                                        onClick={() =>
                                            handleAction(item)
                                        }
                                        disabled={
                                            item.loading
                                        }
                                    >
                                        <span
                                            className={
                                                styles.itemIcon
                                            }
                                        >
                                            {item.icon}
                                        </span>

                                        <span
                                            className={
                                                styles.itemLabel
                                            }
                                        >
                                            {item.label}
                                        </span>

                                        {item.loading && (
                                            <span
                                                className={
                                                    styles.loading
                                                }
                                            >
                                                ...
                                            </span>
                                        )}
                                    </button>
                                )
                            )}

                            {sectionIndex !==
                                sections.length - 1 && (
                                <div
                                    className={
                                        styles.divider
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}